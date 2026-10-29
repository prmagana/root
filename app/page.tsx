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
        <ToolButton label="Tracker" href="https://track.tapt.so" />
        <ToolButton label="Player" href="https://play.tapt.so" />
        <ToolButton label="Former" href="https://form.tapt.so" />
        <ToolButton label="Booker" href="https://book.tapt.so" />
      </main>
      <footer className="absolute inset-x-0 bottom-0 flex justify-center p-6">
        <Socials />
      </footer>
    </>
  );
}
