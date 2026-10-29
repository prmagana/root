"use client";

import { useRef } from "react";
import { animate } from "motion/react";

// Stiff spring in, softer spring out.
const press = { type: "spring", stiffness: 700, damping: 32 } as const;
const settle = { type: "spring", stiffness: 260, damping: 26 } as const;

// One card per tapt tool; the page stacks these.
// width is a width class relative to the stack; the page steps it down.
export default function ToolButton({ label, href, width = "w-full" }: { label: string; href: string; width?: string }) {
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
      className={`block w-full select-none rounded-lg border border-edge bg-surface px-6 py-4 text-center text-[22px] font-semibold leading-tight tracking-tight shadow-md hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800`}
    >
      {label}
    </a>
    </div>
  );
}
