"use client";

import { motion } from "motion/react";

// ton.org's Gram diamond, rebuilt from its Lottie (gram-diamond.json: 60fps, 180 frames, 44px canvas) with motion
// instead of shipping a player. Coordinates are the Lottie's body units; the viewBox frames them as the canvas did.
const BODY = "M0.88 -41C0.88 -41 0.92 -41 0.92 -41C-3.36 -41 -21.86 -41 -23.79 -40.4C-25.51 -39.87 -27.1 -39 -28.47 -37.85C-30.02 -36.55 -31.18 -34.75 -33.49 -31.15C-33.49 -31.15 -43.71 -15.27 -43.71 -15.27C-45.24 -12.89 -46.01 -11.7 -46.21 -10.45C-46.4 -9.35 -46.27 -8.21 -45.86 -7.17C-45.39 -6 -44.39 -5 -42.39 -3C-42.39 -3 -4.42 34.94 -4.42 34.94C-2.65 36.71 -1.76 37.6 -0.74 37.93C0.16 38.22 1.12 38.22 2.02 37.93C3.04 37.6 3.93 36.71 5.7 34.94C5.7 34.94 43.67 -3 43.67 -3C45.67 -5 46.67 -6 47.14 -7.17C47.55 -8.21 47.68 -9.35 47.49 -10.45C47.29 -11.7 46.52 -12.89 44.99 -15.27C44.99 -15.27 34.77 -31.15 34.77 -31.15C32.46 -34.75 31.3 -36.55 29.75 -37.85C28.38 -39 26.79 -39.87 25.07 -40.4C23.13 -41 5.17 -41 0.88 -41Z";
const SPARKLE = "M10.63 -28.47C11.15 -29.88 13.15 -29.88 13.67 -28.47C13.67 -28.47 17.28 -18.72 17.28 -18.72C17.5 -18.14 17.96 -17.68 18.54 -17.46C18.54 -17.46 28.3 -13.85 28.3 -13.85C29.71 -13.33 29.71 -11.34 28.3 -10.82C28.3 -10.82 18.54 -7.21 18.54 -7.21C17.96 -6.99 17.5 -6.53 17.28 -5.95C17.28 -5.95 13.67 3.8 13.67 3.8C13.15 5.21 11.15 5.21 10.63 3.8C10.63 3.8 7.02 -5.95 7.02 -5.95C6.8 -6.53 6.34 -6.99 5.75 -7.21C5.75 -7.21 -4 -10.82 -4 -10.82C-5.41 -11.34 -5.41 -13.33 -4 -13.85C-4 -13.85 5.75 -17.46 5.75 -17.46C6.34 -17.68 6.8 -18.14 7.02 -18.72C7.02 -18.72 10.63 -28.47 10.63 -28.47Z";
// The point each sparkle spins and scales about, as in the source.
const PIVOT = { x: 12.47, y: -12.114 };
const LOOP = 3;
const at = (frame: number) => frame / 180;

// Lottie's bezier handles as motion eases.
const grow = [0.481, 0, 0.691, 1] as const;
const shrink = [0.5, 0, 0.833, 1] as const;
const swing = [0.5, 0, 0.5, 1] as const;

type Ease = readonly [number, number, number, number] | "linear";
type Track = { values: number[]; times: number[]; ease: Ease[] };

// The three small sparkles share one 46-frame figure, started at different frames: pop to 54%, back to 0, half a turn.
function twinkle(start: number): { scale: Track; rotate: Track } {
  return {
    scale: { values: [0, 0, 0.538, 0, 0], times: [0, at(start), at(start + 23), at(start + 46), 1], ease: ["linear", grow, shrink, "linear"] },
    rotate: { values: [180, 180, 360, 360], times: [0, at(start), at(start + 46), 1], ease: ["linear", shrink, "linear"] },
  };
}

// The centre sparkle does the inverse: full, folds away spinning, hides for most of the loop, then unfolds back.
const main = {
  scale: { values: [1, 1, 0, 0, 1, 1], times: [0, at(7), at(29), at(129), at(158), 1], ease: ["linear", swing, "linear", swing, "linear"] },
  rotate: { values: [0, 0, 180, -180, 0, 0], times: [0, at(7), at(29), at(129), at(158), 1], ease: ["linear", swing, "linear", swing, "linear"] },
} satisfies { scale: Track; rotate: Track };

function Sparkle({ x, y, scale, rotate }: { x: number; y: number; scale: Track; rotate: Track }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* fill-box puts the origin on the sparkle itself, so it spins in place like the Lottie's anchor. */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: scale.values[0], rotate: rotate.values[0] }}
        animate={{ scale: scale.values, rotate: rotate.values }}
        transition={{
          scale: { duration: LOOP, times: scale.times, ease: scale.ease, repeat: Infinity },
          rotate: { duration: LOOP, times: rotate.times, ease: rotate.ease, repeat: Infinity },
        }}
      >
        <path d={SPARKLE} fill="#fff" transform={`translate(${-PIVOT.x} ${-PIVOT.y})`} />
      </motion.g>
    </g>
  );
}

// Blue body, white sparkles, always; the brand asks for no recolouring.
export default function GramMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-54.03 -55.31 108.06 108.06" className={className}>
      <path d={BODY} fill="#30a1f5" />
      <Sparkle x={13.592} y={-9.827} {...main} />
      <Sparkle x={-19.333} y={-6.028} {...twinkle(14)} />
      <Sparkle x={13.17} y={6.636} {...twinkle(55)} />
      <Sparkle x={-24.398} y={-24.179} {...twinkle(92)} />
    </svg>
  );
}
