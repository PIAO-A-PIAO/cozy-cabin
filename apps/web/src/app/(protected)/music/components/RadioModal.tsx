"use client";

import type { ReactNode } from "react";
import ClickableWrap from "../../home/components/ClickableWrap";

export default function RadioModal() {
  return (
    <ClickableWrap
      onClick={() => {}}
      hoverSrc="/assets/room/radio_highlight.png"
      defaultWrapperClassName="absolute left-[60%] top-[48%] aspect-[207/154] w-[7%] -translate-x-1/2 [container-type:inline-size]"
      hoverClassName="object-contain drop-shadow-2xl scale-105 translate-y-[0.08em]"
      alt="Pomodoro timer"
      ariaLabel="Open pomodoro timer"
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
