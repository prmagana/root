import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { readTheme, THEME_COOKIE } from "@/lib/theme";
import "./globals.css";

// Same Product Sans setup as form; bold is mapped to 600 to match its font-semibold.
const productSans = localFont({
  src: [
    { path: "./fonts/ProductSansRegular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/ProductSansBold.ttf", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "tapt",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // On <html> before the first paint, so there is no flash and nothing for the toggle to catch up on.
  const theme = readTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="en" data-theme={theme} className="h-full antialiased">
      <body className={`${productSans.className} flex min-h-full flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
