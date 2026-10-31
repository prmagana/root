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
          {/* The offer sits on top, inverted: a call funnel for operators moving their stack to tapt. */}
          <ToolButton label="Migrate" href="https://tapt.software" tone="ink" />
          <ToolButton label="Tracker" href="https://track.tapt.so" width="w-[calc(100%-16px)]" />
          <ToolButton label="Player" href="https://play.tapt.so" width="w-[calc(100%-32px)]" />
          <ToolButton label="Former" href="https://form.tapt.so" width="w-[calc(100%-48px)]" />
          <ToolButton label="Booker" href="https://book.tapt.so" width="w-[calc(100%-64px)]" />
        </div>
      </main>
      {/* The nav's container, so the pills line up under the mark and the sign-in. Three columns keep the socials
          dead centre whatever sits beside them. The side pills never move: when the row is too narrow for all three they
          hide, not wrap. The footer is the container; 426px is the socials' 206 plus the wider side pill, 98, on both sides
          so the centre holds, plus the two 12px gaps. Hidden, not unmounted, so the price still fetches for every visit. */}
      <footer className="@container absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-3 @min-[426px]:grid-cols-[1fr_auto_1fr]">
          <div className="hidden @min-[426px]:col-start-1 @min-[426px]:block @min-[426px]:justify-self-start">
            <TonPrice />
          </div>
          <div className="justify-self-center @min-[426px]:col-start-2">
            <Socials />
          </div>
          <div className="hidden @min-[426px]:col-start-3 @min-[426px]:block @min-[426px]:justify-self-end">
            <ThemeToggle initial={theme} />
          </div>
        </div>
      </footer>
    </>
  );
}
