"use client";

import { useRef, useState } from "react";
import { animate } from "motion/react";

// Stiff spring in, softer spring out.
const press = { type: "spring", stiffness: 700, damping: 32 } as const;
const settle = { type: "spring", stiffness: 260, damping: 26 } as const;

// Pending holds this long; the tab opens immediately regardless.
const PENDING_MS = 1000;

function Spinner() {
  return (
    <svg className="size-5 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-75" />
    </svg>
  );
}

export default function FormButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const pressed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [pending, setPending] = useState(false);

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
  const click = () => {
    clearTimeout(timer.current);
    setPending(true);
    timer.current = setTimeout(() => setPending(false), PENDING_MS);
  };

  // Inactive layer sits scaled down and blurred, so the swap reads as a crossfade.
  const layer = (active: boolean) =>
    `absolute inset-0 flex items-center justify-center gap-2 transition-[opacity,scale,filter] duration-200 ease-in-out motion-reduce:transition-none ${
      active ? "scale-100 opacity-100 blur-none" : "scale-95 opacity-0 blur-[1px]"
    }`;

  return (
    <a
      ref={ref}
      href="https://form.tapt.so"
      target="_blank"
      rel="noopener noreferrer"
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={up}
      onClick={click}
      draggable={false}
      data-state={pending ? "pending" : "idle"}
      className="relative w-full max-w-sm select-none rounded-lg border border-zinc-200 bg-white px-6 py-4 text-center text-[22px] font-semibold leading-tight tracking-tight shadow-md"
    >
      {/* Invisible copy holds the box size; the real labels stack on top of it. */}
      <span className="invisible">Form</span>
      <span className={layer(!pending)}>Form</span>
      <span className={layer(pending)} aria-hidden={!pending}>
        <Spinner />
        Form
      </span>
    </a>
  );
}
