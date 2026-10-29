"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import GramMark from "./gram-mark";

// Same spring as the Telegram button so the two ticks read as one gesture.
const spring = { type: "spring", stiffness: 600, damping: 28 } as const;

type Props = { points: string; price: string; width: number; height: number };

// Rest: the 24h line in grey. Hover or tap: it ticks up and out, the mark and price tick up in, in black.
export default function TonPill({ points, price, width, height }: Props) {
  const [hovered, setHovered] = useState(false);
  // Tap pins the price face, for phones where hover never fires.
  const [pinned, setPinned] = useState(false);
  const showPrice = hovered || pinned;

  return (
    // A widget: fixed 98 by 46 box, the socials' height, the line's 64px plus 16px a side. Faces center in it.
    <motion.button
      type="button"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTap={() => setPinned((p) => !p)}
      aria-label={`TON ${price}, last 24h`}
      className="relative flex h-[46px] w-[98px] cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
            className="flex items-center gap-1.5 text-sm leading-none font-semibold tracking-tight text-black"
          >
            <GramMark className="size-5" />
            {price}
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
            <svg aria-hidden width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
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
