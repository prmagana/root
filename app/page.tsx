import { Nav } from "./nav";
import Socials from "./socials";
import ToolButton from "./tool-button";

// Hub for tapt; links to each repo go here.
export default function Home() {
  return (
    <>
      {/* Nav and socials sit outside the flow so the stack centers on the full viewport. */}
      <header className="absolute inset-x-0 top-0">
        <Nav />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        {/* Each row 16px narrower than the one above. */}
        <ToolButton label="Tracker" href="https://track.tapt.so" width="max-w-[384px]" />
        <ToolButton label="Player" href="https://play.tapt.so" width="max-w-[368px]" />
        <ToolButton label="Former" href="https://form.tapt.so" width="max-w-[352px]" />
        <ToolButton label="Booker" href="https://book.tapt.so" width="max-w-[336px]" />
      </main>
      <footer className="absolute inset-x-0 bottom-0 flex justify-center p-6">
        <Socials />
      </footer>
    </>
  );
}
