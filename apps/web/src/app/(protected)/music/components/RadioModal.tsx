"use client";

import { useState } from "react";
import ClickableWrap from "../../home/components/ClickableWrap";
import Image from "next/image";
import Player from "./Player";
import Playlist from "./Playlist";

export default function RadioModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ClickableWrap
        onClick={() => setIsOpen(true)}
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

      <section
        id="radio-modal-panel"
        aria-hidden={!isOpen}
        className={
          isOpen
            ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
            : "hidden"
        }
      >
        <div className="relative flex h-[min(82vh,46rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-[#f4efe6] p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Close
          </button>

          <div className="mt-8 flex min-h-0 flex-1 flex-col gap-4">
            
            <div className="min-h-0 flex-1 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-[0_12px_40px_rgba(63,38,17,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sm:p-6">
              <Playlist />
            </div>
            <div className="shrink-0 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-[0_12px_40px_rgba(63,38,17,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sm:p-6">
              <Player />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
