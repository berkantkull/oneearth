import type { SVGProps } from "react";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path d="M49 10A24 24 0 1 0 49 54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M32 9V27M32 37V55" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M38 18H50M38 32H54M38 46H50" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12.5 24.5Q22 14 32 14M12.5 39.5Q22 50 32 50" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".58" />
      <circle cx="32" cy="32" r="4.6" fill="#e9bd72" stroke="#020407" strokeWidth="1.5" />
    </svg>
  );
}
