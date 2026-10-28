import Socials from "./socials";
import TelegramMark from "./telegram-mark";
import ToolButton from "./tool-button";

// Hub for tapt; links to each repo go here.
export default function Home() {
  return (
    <>
      {/* Absolute so the links below center on the full viewport, not the space under the bar. */}
      <header className="absolute inset-x-0 top-0 flex justify-center p-6">
        <Socials />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        {/* Mark for the stack: the tools all run on Telegram. */}
        <TelegramMark className="mb-6 size-10 text-black" />
        <ToolButton label="Tracker" href="https://track.tapt.so" />
        <ToolButton label="Player" href="https://play.tapt.so" />
        <ToolButton label="Former" href="https://form.tapt.so" />
        <ToolButton label="Booker" href="https://book.tapt.so" />
      </main>
    </>
  );
}
