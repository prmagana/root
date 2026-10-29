import { cookies } from "next/headers";
import { Nav } from "./nav";
import Socials from "./socials";
import ThemeToggle from "./theme-toggle";
import TonPrice from "./ton-price";
import ToolButton from "./tool-button";
import { readTheme, THEME_COOKIE } from "@/lib/theme";

// Hub for tapt; links to each repo go here.
export default async function Home() {
  const theme = readTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <>
      {/* Nav and footer sit outside the flow so the stack centers on the full viewport. */}
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
      {/* The nav's container, so the pills line up under the mark and the sign-in. Three columns keep the socials
          dead centre whatever sits beside them; on phones the socials take their own row beneath the two pills. */}
      <footer className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="col-start-1 row-start-1 justify-self-start">
            <TonPrice />
          </div>
          <div className="col-span-2 row-start-2 justify-self-center sm:col-span-1 sm:col-start-2 sm:row-start-1">
            <Socials />
          </div>
          <div className="col-start-2 row-start-1 justify-self-end sm:col-start-3">
            <ThemeToggle initial={theme} />
          </div>
        </div>
      </footer>
    </>
  );
}
