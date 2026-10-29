"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { writeTheme, type Theme } from "@/lib/theme";

// Lucide's moon, and for the sun the same 9px circle the moon is cut from, whole. Same stroke, same footprint.
function Sun({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

const slots = [
  { theme: "light", label: "Light theme", Icon: Sun },
  { theme: "dark", label: "Dark theme", Icon: Moon },
] as const;

// Knob x per slot: the pill's p-1 inset, then one 36px slot plus the 4px gap.
const KNOB = { light: 4, dark: 44 } as const;

// The socials' bar with two slots and the same spotlight, except it never hides: it rests on the active theme,
// glides to whichever slot is hovered, and settles on the one clicked. The page follows the click.
export default function ThemeToggle({ initial }: { initial: Theme }) {
  const [theme, setTheme] = useState<Theme>(initial);

  // Same spring as the socials; the ink layer's clip is derived from it so it rides along.
  const x = useMotionValue<number>(KNOB[initial]);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const clip = useTransform(sx, (v) => `circle(18px at ${v + 18}px 50%)`);

  const rest = () => x.set(KNOB[theme]);

  const pick = (next: Theme) => {
    if (next === theme) return;
    setTheme(next);
    x.set(KNOB[next]);
    // Crossfade where View Transitions exist; elsewhere it just switches.
    if ("startViewTransition" in document) document.startViewTransition(() => writeTheme(next));
    else writeTheme(next);
  };

  return (
    <div
      role="group"
      aria-label="Theme"
      onMouseLeave={rest}
      // Only settle on blur when focus leaves the bar entirely, so tabbing glides too.
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && rest()}
      className="relative flex items-center gap-1 rounded-full border border-edge bg-surface p-1 shadow-md"
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-y-1 left-0 w-9 rounded-full bg-spot" style={{ x: sx }} />
      {/* Grey layer: the buttons live here so hover, focus and click keep working. */}
      {slots.map(({ theme: t, label, Icon }) => (
        <button
          key={t}
          type="button"
          aria-label={label}
          aria-pressed={theme === t}
          onMouseEnter={() => x.set(KNOB[t])}
          onFocus={() => x.set(KNOB[t])}
          onClick={() => pick(t)}
          className="relative flex size-9 cursor-pointer items-center justify-center rounded-full text-muted outline-none"
        >
          <Icon className="size-5" />
        </button>
      ))}
      {/* Ink layer: same layout stacked on top, clipped to the circle so it reveals as the circle moves. */}
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 flex items-center gap-1 p-1 text-ink" style={{ clipPath: clip }}>
        {slots.map(({ theme: t, Icon }) => (
          <span key={t} className="flex size-9 items-center justify-center">
            <Icon className="size-5" />
          </span>
        ))}
      </motion.span>
    </div>
  );
}
