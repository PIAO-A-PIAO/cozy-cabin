#!/usr/bin/env python3
"""Remove chroma-key backgrounds from Cozy Cabin asset images.

The script keeps only the edge-connected chroma background transparent, so
legitimate green or magenta colors inside the asset are preserved whenever
possible.
"""

from __future__ import annotations

import argparse
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import Sequence

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - import error path
    raise SystemExit(
        "Pillow is required. Install it with: pip install pillow"
    ) from exc


SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
GREEN_KEY = (0, 255, 0)
MAGENTA_KEY = (255, 0, 255)


@dataclass(frozen=True)
class ProcessOptions:
    key_color: tuple[int, int, int]
    threshold: int
    softness: int
    edge_cleanup: int
    crop: bool
    padding: int
    preview: bool
    debug_mask: bool
    debug_edge: bool


def parse_positive_int(value: str) -> int:
    try:
        parsed = int(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError(f"Invalid integer: {value}") from exc
    if parsed < 0:
        raise argparse.ArgumentTypeError("Value must be greater than or equal to 0.")
    return parsed


def parse_threshold(value: str) -> int:
    parsed = parse_positive_int(value)
    if parsed > 255:
        raise argparse.ArgumentTypeError("Threshold must be between 0 and 255.")
    return parsed


def parse_softness(value: str) -> int:
    parsed = parse_positive_int(value)
    if parsed == 0:
        raise argparse.ArgumentTypeError("Softness must be greater than 0.")
    return parsed


def parse_hex_color(value: str) -> tuple[int, int, int]:
    raw = value.strip()
    if raw.startswith("#"):
        raw = raw[1:]
    if len(raw) != 6:
        raise argparse.ArgumentTypeError(
            f"Invalid hex color '{value}'. Use format like #00FF00."
        )
    try:
        red = int(raw[0:2], 16)
        green = int(raw[2:4], 16)
        blue = int(raw[4:6], 16)
    except ValueError as exc:
        raise argparse.ArgumentTypeError(
            f"Invalid hex color '{value}'. Use format like #00FF00."
        ) from exc
    return red, green, blue


def color_distance(pixel: tuple[int, int, int], key: tuple[int, int, int]) -> float:
    return (
        (pixel[0] - key[0]) ** 2
        + (pixel[1] - key[1]) ** 2
        + (pixel[2] - key[2]) ** 2
    ) ** 0.5


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def alpha_from_distance(
    distance: float,
    threshold: int,
    softness: int,
    edge_cleanup: int,
) -> int:
    effective_threshold = max(0, threshold - edge_cleanup)
    effective_softness = max(1, softness + edge_cleanup)

    if distance <= effective_threshold:
        return 0
    if distance >= effective_threshold + effective_softness:
        return 255

    mix = (distance - effective_threshold) / float(effective_softness)
    return int(round(smoothstep(mix) * 255))


def is_supported_image(path: Path) -> bool:
    return path.suffix.lower() in SUPPORTED_EXTENSIONS


def candidate_background_mask(
    image: Image.Image,
    key_color: tuple[int, int, int],
    threshold: int,
    softness: int,
) -> list[bool]:
    width, height = image.size
    rgb_image = image.convert("RGB")
    pixels = rgb_image.load()
    limit = threshold + softness
    mask = [False] * (width * height)

    def index(x: int, y: int) -> int:
        return y * width + x

    queue: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        idx = index(x, y)
        if mask[idx]:
            return
        distance = color_distance(pixels[x, y], key_color)
        if distance <= limit:
            mask[idx] = True
            queue.append((x, y))

    for x in range(width):
        seed(x, 0)
        if height > 1:
            seed(x, height - 1)
    for y in range(height):
        seed(0, y)
        if width > 1:
            seed(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            idx = index(nx, ny)
            if mask[idx]:
                continue
            distance = color_distance(pixels[nx, ny], key_color)
            if distance <= limit:
                mask[idx] = True
                queue.append((nx, ny))

    return mask


def background_distance_map(background_mask: list[bool], width: int, height: int) -> list[int]:
    """Return 4-neighbor distance from each pixel to the edge-connected background."""

    distances = [-1] * (width * height)
    queue: deque[tuple[int, int]] = deque()

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if not background_mask[idx]:
                continue
            distances[idx] = 0
            queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        base_idx = y * width + x
        base_distance = distances[base_idx]
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            idx = ny * width + nx
            next_distance = base_distance + 1
            if distances[idx] != -1 and distances[idx] <= next_distance:
                continue
            distances[idx] = next_distance
            queue.append((nx, ny))

    return distances


def gather_local_foreground_average(
    pixels,
    alpha_map: list[int],
    background_mask: list[bool],
    width: int,
    height: int,
    x: int,
    y: int,
    radius: int,
) -> tuple[int, int, int] | None:
    red_total = 0
    green_total = 0
    blue_total = 0
    count = 0

    for ny in range(max(0, y - radius), min(height, y + radius + 1)):
        for nx in range(max(0, x - radius), min(width, x + radius + 1)):
            idx = ny * width + nx
            if background_mask[idx] or alpha_map[idx] < 240:
                continue
            red, green, blue, _alpha = pixels[nx, ny]
            red_total += red
            green_total += green
            blue_total += blue
            count += 1

    if count == 0:
        return None

    return (
        int(round(red_total / count)),
        int(round(green_total / count)),
        int(round(blue_total / count)),
    )


def suppress_chroma_spill(
    rgb: tuple[int, int, int],
    key_color: tuple[int, int, int],
    alpha: int,
    local_average: tuple[int, int, int] | None = None,
    edge_distance: int | None = None,
) -> tuple[int, int, int]:
    if alpha <= 0:
        return rgb

    red, green, blue = rgb
    key_red, key_green, key_blue = key_color

    if alpha < 255:
        coverage = max(0.0, min(1.0, alpha / 255.0))
        background_mix = 1.0 - coverage
    elif edge_distance is not None and edge_distance > 0:
        # Opaque pixels near the edge can still contain spill from nearby chroma.
        # Use a conservative virtual background mix based on proximity to the edge.
        background_mix = min(0.45, 0.14 + 0.22 / edge_distance)
        coverage = 1.0 - background_mix
    else:
        return rgb

    # Reconstruct the foreground color by subtracting the estimated chroma
    # background contribution from the pixel.
    reconstructed = []
    for channel, key_channel in ((red, key_red), (green, key_green), (blue, key_blue)):
        value = (channel - key_channel * background_mix) / max(coverage, 0.02)
        reconstructed.append(int(round(max(0.0, min(255.0, value)))))

    if local_average is not None:
        blend = min(0.55, background_mix * 0.7 + 0.08)
        reconstructed = [
            int(round(reconstructed[i] * (1.0 - blend) + local_average[i] * blend))
            for i in range(3)
        ]

    red, green, blue = reconstructed
    if key_green >= max(key_red, key_blue):
        excess_green = green - max(red, blue)
        if excess_green > 0:
            green = max(red, blue) + int(round(excess_green * 0.2))
    elif key_red >= key_blue:
        excess_red = red - max(green, blue)
        if excess_red > 0:
            red = max(green, blue) + int(round(excess_red * 0.2))
    elif key_blue >= key_red:
        excess_blue = blue - max(red, green)
        if excess_blue > 0:
            blue = max(red, green) + int(round(excess_blue * 0.2))

    return red, green, blue


def build_alpha_map(
    background_mask: list[bool],
    distance_map: list[int],
    width: int,
    height: int,
    key_color: tuple[int, int, int],
    threshold: int,
    softness: int,
    edge_cleanup: int,
    pixels,
) -> tuple[list[int], list[bool]]:
    alpha_map = [255] * (width * height)
    edge_band = [False] * (width * height)

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            rgb = pixels[x, y][:3]
            distance = color_distance(rgb, key_color)
            is_background = background_mask[idx]
            is_edge_band = (not is_background) and distance_map[idx] != -1 and distance_map[idx] <= edge_cleanup
            edge_band[idx] = is_edge_band

            if is_background or is_edge_band:
                alpha_map[idx] = alpha_from_distance(
                    distance, threshold, softness, edge_cleanup
                )
                if is_edge_band:
                    proximity = max(
                        0.0,
                        min(
                            1.0,
                            (edge_cleanup + 1 - distance_map[idx]) / max(1, edge_cleanup + 1),
                        ),
                    )
                    alpha_map[idx] = int(round(alpha_map[idx] * (1.0 - 0.35 * proximity)))
            else:
                alpha_map[idx] = 255

    return alpha_map, edge_band


def build_debug_edge_image(
    background_mask: list[bool],
    edge_band: list[bool],
    alpha_map: list[int],
    width: int,
    height: int,
) -> Image.Image:
    debug = Image.new("RGBA", (width, height), (235, 235, 235, 255))
    debug_pixels = debug.load()

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if background_mask[idx]:
                debug_pixels[x, y] = (110, 170, 255, 255)
            elif edge_band[idx]:
                debug_pixels[x, y] = (255, 110, 110, 255)
            elif alpha_map[idx] >= 255:
                debug_pixels[x, y] = (180, 180, 180, 255)
            else:
                shade = 120 + int((alpha_map[idx] / 255) * 80)
                debug_pixels[x, y] = (shade, shade, shade, 255)

    return debug


def build_alpha_and_rgb(
    image: Image.Image,
    key_color: tuple[int, int, int],
    threshold: int,
    softness: int,
    edge_cleanup: int,
) -> tuple[Image.Image, Image.Image, Image.Image]:
    source = image.convert("RGBA")
    width, height = source.size
    pixels = source.load()
    background_mask = candidate_background_mask(
        source, key_color, threshold, softness
    )
    distance_map = background_distance_map(background_mask, width, height)
    alpha_map, edge_band = build_alpha_map(
        background_mask,
        distance_map,
        width,
        height,
        key_color,
        threshold,
        softness,
        edge_cleanup,
        pixels,
    )

    result = Image.new("RGBA", source.size)
    result_pixels = result.load()
    mask_image = Image.new("L", source.size)
    mask_pixels = mask_image.load()
    debug_edge = build_debug_edge_image(
        background_mask, edge_band, alpha_map, width, height
    )

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            red, green, blue, _alpha = pixels[x, y]
            alpha = alpha_map[idx]

            if background_mask[idx] or edge_band[idx]:
                local_average = None
                if edge_band[idx] and alpha < 255:
                    local_average = gather_local_foreground_average(
                        pixels,
                        alpha_map,
                        background_mask,
                        width,
                        height,
                        x,
                        y,
                        max(1, edge_cleanup + 1),
                    )
                red, green, blue = suppress_chroma_spill(
                    (red, green, blue),
                    key_color,
                    alpha,
                    local_average=local_average,
                    edge_distance=distance_map[idx],
                )

            result_pixels[x, y] = (red, green, blue, alpha)
            mask_pixels[x, y] = alpha

    return result, mask_image, debug_edge


def crop_to_content(
    image: Image.Image,
    padding: int,
) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return image

    left = max(0, bbox[0] - padding)
    upper = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    lower = min(image.height, bbox[3] + padding)
    return image.crop((left, upper, right, lower))


def build_preview(image: Image.Image) -> Image.Image:
    width, height = image.size
    tile = 16
    preview = Image.new("RGBA", image.size, (235, 235, 235, 255))
    preview_pixels = preview.load()
    for y in range(height):
        for x in range(width):
            shade = 220 if ((x // tile) + (y // tile)) % 2 == 0 else 245
            preview_pixels[x, y] = (shade, shade, shade, 255)
    return Image.alpha_composite(preview, image.convert("RGBA"))


def output_paths_for_single(input_path: Path, output: Path | None) -> tuple[Path, Path | None, Path | None]:
    if output is None:
        base = input_path.with_name(f"{input_path.stem}_transparent.png")
        return base, base.with_name(f"{base.stem}_preview.png"), base.with_name(
            f"{base.stem}_mask.png"
        )

    if output.suffix.lower() == ".png":
        return output, output.with_name(f"{output.stem}_preview.png"), output.with_name(
            f"{output.stem}_mask.png"
        )

    output.mkdir(parents=True, exist_ok=True)
    base = output / f"{input_path.stem}.png"
    return base, base.with_name(f"{base.stem}_preview.png"), base.with_name(
        f"{base.stem}_mask.png"
    )


def process_image(
    input_path: Path,
    output_path: Path | None,
    options: ProcessOptions,
) -> Path:
    if not input_path.exists():
        raise FileNotFoundError(f"File not found: {input_path}")
    if not is_supported_image(input_path):
        raise ValueError(f"Unsupported image format: {input_path.suffix}")

    try:
        image = Image.open(input_path)
        image.load()
    except Exception as exc:
        raise ValueError(f"Could not decode image: {input_path}") from exc

    result, mask, debug_edge = build_alpha_and_rgb(
        image,
        options.key_color,
        options.threshold,
        options.softness,
        options.edge_cleanup,
    )

    if options.crop:
        result = crop_to_content(result, options.padding)
        mask = crop_to_content(mask.convert("RGBA"), options.padding).convert("L")

    actual_output, preview_output, mask_output = output_paths_for_single(
        input_path, output_path
    )
    actual_output.parent.mkdir(parents=True, exist_ok=True)
    result.save(actual_output, format="PNG")

    if options.preview and preview_output is not None:
        build_preview(result).save(preview_output, format="PNG")

    if options.debug_mask and mask_output is not None:
        mask.save(mask_output, format="PNG")

    if options.debug_edge:
        debug_edge_output = actual_output.with_name(f"{actual_output.stem}_edge.png")
        debug_edge.save(debug_edge_output, format="PNG")

    return actual_output


def collect_directory_images(directory: Path) -> list[Path]:
    return sorted(
        path
        for path in directory.iterdir()
        if path.is_file() and is_supported_image(path)
    )


def process_directory(
    directory: Path,
    output_directory: Path | None,
    options: ProcessOptions,
) -> tuple[int, int]:
    if not directory.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")
    if not directory.is_dir():
        raise ValueError(f"Not a directory: {directory}")

    images = collect_directory_images(directory)
    processed = 0
    failed = 0

    if output_directory is not None and output_directory.suffix.lower() == ".png":
        raise ValueError("Output path for directory processing must be a directory.")

    if output_directory is not None and output_directory.suffix.lower() != ".png":
        output_directory.mkdir(parents=True, exist_ok=True)

    for image_path in images:
        try:
            if output_directory is None:
                target_output = None
            else:
                target_output = output_directory / f"{image_path.stem}.png"
            process_image(image_path, target_output, options)
            processed += 1
        except Exception as exc:
            failed += 1
            print(f"Failed: {image_path.name} - {exc}")

    return processed, failed


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Remove chroma-key backgrounds from Cozy Cabin asset images."
    )
    parser.add_argument("input", type=Path, help="Input image file or directory.")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output file or directory. If omitted for a single image, a _transparent suffix is used.",
    )
    parser.add_argument(
        "--key",
        choices=("green", "magenta"),
        default="green",
        help="Chroma-key preset to remove.",
    )
    parser.add_argument(
        "--color",
        type=parse_hex_color,
        default=None,
        help='Custom chroma-key color as hex, e.g. "#00FF00". Overrides --key.',
    )
    parser.add_argument(
        "--threshold",
        type=parse_threshold,
        default=60,
        help="Distance below which pixels are considered background.",
    )
    parser.add_argument(
        "--softness",
        type=parse_softness,
        default=25,
        help="Transition width between transparent and opaque pixels.",
    )
    parser.add_argument(
        "--edge-cleanup",
        type=parse_positive_int,
        default=1,
        help="Extra cleanup around the background boundary in pixels.",
    )
    parser.add_argument(
        "--crop",
        action="store_true",
        help="Crop transparent padding around the asset after removal.",
    )
    parser.add_argument(
        "--padding",
        type=parse_positive_int,
        default=20,
        help="Transparent padding to keep when cropping.",
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Write a preview PNG on a neutral checkerboard background.",
    )
    parser.add_argument(
        "--debug-mask",
        action="store_true",
        help="Write the generated alpha mask as a grayscale PNG.",
    )
    parser.add_argument(
        "--debug-edge",
        action="store_true",
        help="Write a debug image highlighting the background and edge-cleanup band.",
    )
    return parser


def resolve_key_color(args: argparse.Namespace) -> tuple[int, int, int]:
    if args.color is not None:
        return args.color
    if args.key == "magenta":
        return MAGENTA_KEY
    return GREEN_KEY


def build_options(args: argparse.Namespace) -> ProcessOptions:
    if args.threshold < 0 or args.threshold > 255:
        raise ValueError("--threshold must be between 0 and 255.")
    if args.softness <= 0:
        raise ValueError("--softness must be greater than 0.")
    return ProcessOptions(
        key_color=resolve_key_color(args),
        threshold=args.threshold,
        softness=args.softness,
        edge_cleanup=args.edge_cleanup,
        crop=args.crop,
        padding=args.padding,
        preview=args.preview,
        debug_mask=args.debug_mask,
        debug_edge=args.debug_edge,
    )


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        options = build_options(args)
    except Exception as exc:
        parser.error(str(exc))

    input_path: Path = args.input

    try:
        if input_path.is_dir():
            output_directory = args.output
            processed, failed = process_directory(input_path, output_directory, options)
            output_label = str(output_directory or input_path)
            print(f"Processed: {processed}")
            print(f"Failed: {failed}")
            print(f"Output: {output_label}")
            return 0 if failed == 0 else 1

        result_path = process_image(input_path, args.output, options)
        print(f"Output: {result_path}")
        return 0
    except FileNotFoundError as exc:
        parser.error(str(exc))
    except ValueError as exc:
        parser.error(str(exc))


if __name__ == "__main__":
    raise SystemExit(main())
