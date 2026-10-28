"use client";

import { useRef } from "react";
import { animate } from "motion/react";

// Stiff spring in, softer spring out.
const press = { type: "spring", stiffness: 700, damping: 32 } as const;
const settle = { type: "spring", stiffness: 260, damping: 26 } as const;

// One card per tapt tool; the page stacks these.
export default function ToolButton({ label, href }: { label: string; href: string }) {
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
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={up}
      draggable={false}
      // No transition: hover snaps so moving between buttons stays crisp.
      className="w-full max-w-sm select-none rounded-lg border border-zinc-200 bg-white px-6 py-4 text-center text-[22px] font-semibold leading-tight tracking-tight shadow-md hover:border-zinc-300 hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}
