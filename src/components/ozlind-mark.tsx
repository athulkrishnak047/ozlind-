import type { SVGProps } from "react";

export function OzlindMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path d="M8 27.5 20 7l12 20.5H8Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="m13.5 27.5 6.5-11 6.5 11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 32h7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="20" cy="27.5" r="2" fill="currentColor" />
    </svg>
  );
}
