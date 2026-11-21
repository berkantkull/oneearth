"use client";

import { Layers3, X } from "lucide-react";
import { motion } from "motion/react";
import { formatCoordinates } from "@/lib/coordinates";
import type { Light } from "@/types/light";
import type { Copy, Locale } from "@/lib/i18n";
import { ShareLight } from "./share-light";

type Props = {
  light: Light;
  relatedLights: Light[];
  locale: Locale;
  copy: Copy;
  onClose: () => void;
  onSelect: (light: Light) => void;
};

export function LightDetails({ light, relatedLights, locale, copy, onClose, onSelect }: Props) {
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
      {relatedLights.length > 1 && (
        <div className="location-cluster">
          <div className="location-cluster-title">
            <Layers3 size={15} aria-hidden="true" />
            <span>{copy.locationCluster.replace("{count}", relatedLights.length.toLocaleString(locale === "tr" ? "tr-TR" : "en-US"))}</span>
          </div>
          <div className="location-cluster-list" aria-label={copy.locationClusterList}>
            {relatedLights.map((item) => (
              <button key={item.id} className={item.id === light.id ? "active" : ""} type="button" onClick={() => onSelect(item)} aria-pressed={item.id === light.id}>
                <strong>{item.word}</strong>
                <span>{new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en", { day: "numeric", month: "short" }).format(new Date(item.createdAt))}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="detail-meta">
        <span>{formatCoordinates(light.latitude, light.longitude, locale)}</span>
        <span>{new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(light.createdAt))}</span>
      </div>
      <ShareLight light={light} locale={locale} copy={copy} />
    </motion.aside>
  );
}
