"use client";

import type { ReactNode } from "react";
import ClickableWrap from "../../home/components/ClickableWrap";
import Image from "next/image";

export default function RadioModal() {
  return (
    <ClickableWrap
      onClick={() => {}}
      hoverSrc="/assets/room/radio_highlight.png"
      defaultWrapperClassName="absolute left-[55%] top-[39%] aspect-[321/246] w-[11%] -translate-x-1/2"
      hoverClassName="object-contain drop-shadow-2xl -translate-y-[0.08em]"
      alt="Radio"
      ariaLabel="Open radio modal"
    >
      <Image
        src="/assets/room/radio.png"
        alt="Radio"
        fill
        sizes="100vw"
        draggable={false}
        className="pointer-events-none object-contain drop-shadow-2xl"
      />
    </ClickableWrap>
  );
}
