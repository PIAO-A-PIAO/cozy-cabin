import Image from "next/image";
import PomodoroModal from "../focus/components/PomodoroModal";
import RadioModal from "../music/components/RadioModal";

const foregroundAssets = [
  {
    src: "/assets/room/flower_shelf.png",
    alt: "Flower shelf",
    wrapperClassName:
      "absolute left-[2%] top-[32%] aspect-[384/772] w-[16%]",
  },
  {
    src: "/assets/room/beehive.png",
    alt: "Bee hive",
    wrapperClassName:
      "absolute left-[29.3%] top-[30.7%] aspect-[384/371] w-[2%]",
  },
  {
    src: "/assets/room/pot.png",
    alt: "Pot",
    wrapperClassName:
      "absolute left-[6.2%] top-[43%] aspect-[148/139] w-[7%]",
  },
  {
    src: "/assets/room/letter_catcher_full.png",
    alt: "Letter catcher full",
    wrapperClassName:
      "absolute left-[4%] top-[11%] aspect-[334/298] w-[13%] rotate-[-1deg]",
  },
  {
    src: "/assets/room/achievement_board.png",
    alt: "Achievement board",
    wrapperClassName:
      "absolute right-[6%] top-[10%] aspect-[626/461] w-[26%]",
  },
  {
    src: "/assets/room/bookshelf.png",
    alt: "Bookshelf",
    wrapperClassName:
      "absolute left-[67%] bottom-[12%] aspect-[837/702] w-[30%]",
  },
  {
    src: "/assets/room/desk.png",
    alt: "Desk",
    wrapperClassName:
      "absolute left-[42%] bottom-[5%] aspect-[1466/804] w-[54%] -translate-x-1/2",
  },
  {
    src: "/assets/room/windowframe.png",
    alt: "Window frame",
    wrapperClassName:
      "absolute left-[19.5%] top-[4%] h-auto aspect-[1149/596] w-[46%]",
  },
  {
    src: "/assets/room/lamp.png",
    alt: "Lamp",
    wrapperClassName:
      "absolute left-[22%] top-[30%] aspect-[230/379] w-[8%]",
  },
  {
    src: "/assets/room/book.png",
    alt: "Book",
    wrapperClassName:
      "absolute left-[78%] top-[69.5%] aspect-[293/249] w-[10%] -translate-x-1/2",
  },
  {
    src: "/assets/room/paper_and_pen.png",
    alt: "Paper and pen",
    wrapperClassName:
      "absolute left-[41%] top-[46%] aspect-[292/178] w-[10%] -translate-x-1/2",
  },
  {
    src: "/assets/room/dog.png",
    alt: "Dog",
    wrapperClassName:
      "absolute left-[36%] bottom-[8%] aspect-[353/314] w-[13%]",
  },
] as const;

export default function HomePage() {
  return (
    <main className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#e8dcc9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_45%),linear-gradient(180deg,rgba(255,245,230,0.85),rgba(232,220,201,0.92))]" />

      <section className="relative flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4">
        <div className="relative aspect-[16/9] h-[calc(100vh-5.5rem)] max-h-full w-auto overflow-hidden rounded-[2rem] border border-white/45 shadow-[0_30px_100px_rgba(63,38,17,0.2)]">
          <Image
            src="/assets/room/background.png"
            alt="Room background"
            fill
            priority
            sizes="100vw"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="relative h-full w-full">
            <div
              key="weather"
              className="absolute left-[23%] top-[6%] aspect-[1149/596] h-auto w-[40%]"
            >
              <Image
                src="/assets/weather/clear.jpg"
                alt="Clear weather view"
                fill
                sizes="100vw"
                draggable={false}
                className="object-cover"
              />
            </div>
            {foregroundAssets.map((asset) => (
              <div key={asset.src} className={asset.wrapperClassName}>
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            ))}
            <RadioModal />
            <PomodoroModal />
          </div>
        </div>
      </section>
    </main>
  );
}
