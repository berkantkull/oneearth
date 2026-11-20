"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { formatCoordinates } from "@/lib/coordinates";
import type { Light } from "@/types/light";
import type { Copy, Locale } from "@/lib/i18n";
import { ShareLight } from "./share-light";

export function LightDetails({ light, locale, copy, onClose }: { light: Light; locale: Locale; copy: Copy; onClose: () => void }) {
  return (
    <motion.aside
      className="light-details glass-panel"
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      aria-live="polite"
    >
      <button className="icon-button close-detail" onClick={onClose} aria-label={copy.closeDetails}><X size={17} /></button>
      <p className="eyebrow">{copy.earthLight}</p>
      <p className="light-word">{light.word}</p>
      <div className="detail-meta">
        <span>{formatCoordinates(light.latitude, light.longitude, locale)}</span>
        <span>{new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(light.createdAt))}</span>
      </div>
      <ShareLight light={light} locale={locale} copy={copy} />
    </motion.aside>
  );
}
