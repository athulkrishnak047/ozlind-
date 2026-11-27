import type { SVGProps } from "react";
export function OzlindMark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
    <rect x="1" y="1" width="38" height="38" rx="12" fill="currentColor" fillOpacity=".055" stroke="currentColor" strokeOpacity=".18" />
    <path d="M10 25.5 20 8l10 17.5H10Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
    <path d="M14.5 25.5 20 16l5.5 9.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="29.5" r="2" fill="currentColor" />
  </svg>;
}
