"use client";

import { useRef } from "react";
import { animate } from "motion/react";

// Stiff spring in, softer spring out.
const press = { type: "spring", stiffness: 700, damping: 32 } as const;
const settle = { type: "spring", stiffness: 260, damping: 26 } as const;

// One card per tapt tool; the page stacks these.
// width is a width class relative to the stack; the page steps it down.
// tone: surface is the tools' card; ink inverts it, black on white pages and white on black ones.
type Props = { label: string; href: string; width?: string; tone?: "surface" | "ink" };

// Hover snaps one zinc step, in the direction the face can go.
const faces = {
  surface: "border-edge bg-surface hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800",
  ink: "border-ink bg-ink text-background hover:border-zinc-800 hover:bg-zinc-800 dark:hover:border-zinc-200 dark:hover:bg-zinc-200",
};

export default function ToolButton({ label, href, width = "w-full", tone = "surface" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pressed = useRef(false);

  const down = () => {
    if (!ref.current) return;
    pressed.current = true;
    animate(ref.current, { scale: 0.97, y: 1 }, press);
  };
  const up = () => {
    if (!ref.current || !pressed.current) return;
    pressed.current = false;
    animate(ref.current, { scale: 1, y: 0 }, settle);
  };

  return (
    // A shallow 3D tilt so the card reads as a narrow-bottomed trapezoid while keeping its rounding.
    <div className={`${width} [transform:perspective(700px)_rotateX(-8deg)]`}>
    <a
      ref={ref}
      href={href}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={up}
      draggable={false}
      // No transition: hover snaps so moving between buttons stays crisp.
      className={`block w-full select-none rounded-lg border px-6 py-4 text-center text-[22px] font-semibold leading-tight tracking-tight shadow-md ${faces[tone]}`}
    >
      {label}
    </a>
    </div>
  );
}
