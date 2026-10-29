"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import GramMark from "./gram-mark";

// Same spring as the Telegram button so the two ticks read as one gesture.
const spring = { type: "spring", stiffness: 600, damping: 28 } as const;

type Props = { path: string; price: string; width: number; height: number };

// Rest: the 24h line. Hover: it ticks up and out, the mark and price tick up in.
export default function TonPill({ path, price, width, height }: Props) {
  const [hovered, setHovered] = useState(false);
  // Click does nothing yet; hover alone flips the face.
  const showPrice = hovered;

  return (
    // A widget: fixed 98 by 46 box, the socials' height, the line's 64px plus 16px a side. Faces center in it.
    <motion.button
      type="button"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-label={`TON ${price}, last 24h`}
      className="relative flex h-[46px] w-[98px] cursor-pointer items-center justify-center rounded-full border border-edge bg-surface shadow-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {/* initial={false}: the server-rendered chart must not animate in on load. */}
      <AnimatePresence mode="popLayout" initial={false}>
        {showPrice ? (
          <motion.span
            key="price"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={spring}
            // Spans exactly the chart's width, mark at one end and price at the other, so the two faces share an extent.
            style={{ width }}
            className="flex items-center justify-between text-sm leading-none font-semibold tracking-tight text-ink"
          >
            <GramMark className="size-5" />
            {/* text-box trims the line box to cap height and baseline, so the digits centre on the mark, not the font's leading. */}
            <span className="[text-box:trim-both_cap_alphabetic]">{price}</span>
          </motion.span>
        ) : (
          <motion.span
            key="chart"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={spring}
            // ton.org's chart accent, so the line matches the Gram mark's world rather than the grey socials.
            className="flex items-center text-[#1eaefb]"
          >
            {/* overflow-visible: the round caps reach a pixel past the first and last point. */}
            <svg aria-hidden width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
              <defs>
                {/* Fades in from the day's start to full colour at now. userSpaceOnUse spans the box, not the path's bbox. */}
                <linearGradient id="ton-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={width} y2="0">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d={path}
                fill="none"
                stroke="url(#ton-line)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
