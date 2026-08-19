"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";

type ClickableWrapProps = {
  hoverSrc: string;
  hoverClassName?: string;
  defaultWrapperClassName?: string;
  alt: string;
  ariaLabel?: string;
  onClick?: () => void;
  children?: ReactNode;
};

export default function ClickableWrap({
  hoverSrc,
  hoverClassName = "",
  defaultWrapperClassName = "",
  alt: _alt,
  ariaLabel,
  onClick,
  children,
}: ClickableWrapProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
      className={`relative block ${defaultWrapperClassName}`}
    >
      {isHovered ? (
        <Image
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          draggable={false}
          className={`pointer-events-none z-0 ${hoverClassName}`}
        />
      ) : null}
      <div className="absolute inset-0 z-10">{children}</div>
      <span className="sr-only">{_alt}</span>
    </button>
  );
}
