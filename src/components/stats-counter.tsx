import type { Copy, Locale } from "@/lib/i18n";

type Props = { count: number; locale: Locale; copy: Copy };

export function StatsCounter({ count, locale, copy }: Props) {
  return (
    <div className="stats-counter" aria-label={`${count} lights on Earth`}>
      <span className="live-dot" aria-hidden="true" />
      <span>{count.toLocaleString(locale === "tr" ? "tr-TR" : "en-US")} {count === 1 ? copy.light : copy.lights}</span>
    </div>
  );
}
