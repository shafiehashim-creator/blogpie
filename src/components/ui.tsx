import Link from "next/link";
import type { ComponentProps } from "react";

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent ${className}`}>{children}</p>
  );
}

export function Badge({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "bg-accent text-on" : "border border-muted text-muted"
      }`}
    >
      {children}
    </span>
  );
}

const btnBase = "inline-flex items-center justify-center rounded-full font-medium transition";
export const btnPrimary = `${btnBase} min-h-[52px] bg-accent px-6 text-on hover:opacity-90`;
export const btnGhost = `${btnBase} min-h-[48px] border border-line px-6 hover:bg-soft`;

export function ButtonLink({ variant = "primary", className = "", ...props }: ComponentProps<typeof Link> & { variant?: "primary" | "ghost" }) {
  return <Link {...props} className={`${variant === "primary" ? btnPrimary : btnGhost} ${className}`} />;
}

export function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z" />
    </svg>
  );
}
