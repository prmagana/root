import type { Metadata } from "next";
import localFont from "next/font/local";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${productSans.className} flex min-h-full flex-col text-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
