import { Nav } from "./nav";
import Socials from "./socials";
import TonPrice from "./ton-price";
import ToolButton from "./tool-button";

// Hub for tapt; links to each repo go here.
export default function Home() {
  return (
    <>
      {/* Nav and socials sit outside the flow so the stack centers on the full viewport. */}
      <header className="absolute inset-x-0 top-0">
        <Nav />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        {/* The stack caps at 384px; each row is 16px narrower than the one above at any width. */}
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <ToolButton label="Tracker" href="https://track.tapt.so" />
          <ToolButton label="Player" href="https://play.tapt.so" width="w-[calc(100%-16px)]" />
          <ToolButton label="Former" href="https://form.tapt.so" width="w-[calc(100%-32px)]" />
          <ToolButton label="Booker" href="https://book.tapt.so" width="w-[calc(100%-48px)]" />
        </div>
      </main>
      {/* Wraps on narrow screens so the price sits above the socials instead of squeezing them. */}
      <footer className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-3 p-6">
        <TonPrice />
        <Socials />
      </footer>
    </>
  );
}
