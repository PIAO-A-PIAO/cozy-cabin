# Tools

## `remove_chroma.py`

`tools/remove_chroma.py` removes flat chroma-key backgrounds from Cozy Cabin AI-generated asset images and exports transparent RGBA PNG files.

Why it exists:
- Cozy Cabin assets are generated against a solid chroma background so they can be cut out cleanly.
- This utility turns those images into transparent PNGs for use in the Next.js frontend.

Install Pillow if needed:

```bash
pip install pillow
```

### Background modes

- `--key green` removes `#00FF00` backgrounds
- `--key magenta` removes `#FF00FF` backgrounds
- `--color "#RRGGBB"` overrides the preset key color

### Basic usage

```bash
python tools/remove_chroma.py input.png
```

This writes:

```text
input_transparent.png
```

### Batch usage

```bash
python tools/remove_chroma.py assets/raw --output assets/processed
```

This processes supported image files in the directory and writes transparent PNGs to the output directory.

### Tuning edge cleanup

If an asset has a fringe from the chroma background, tune:

- `--threshold` for how close a pixel must be to the key color to count as background
- `--softness` for how gradually alpha transitions from transparent to opaque
- `--edge-cleanup` for a small amount of extra cleanup near the edge

Example:

```bash
python tools/remove_chroma.py clock.png --threshold 70 --softness 25 --edge-cleanup 1
```

### Preview and debug output

```bash
python tools/remove_chroma.py radio.png --preview --debug-mask
```

- `--preview` writes a checkerboard preview PNG for inspection
- `--debug-mask` writes the generated alpha mask as a grayscale PNG

### Recommended workflow

```text
AI-generated asset with solid chroma background
        ->
assets/raw/
        ->
remove_chroma.py
        ->
transparent RGBA PNG
        ->
apps/web/public/assets/cabin/
```
