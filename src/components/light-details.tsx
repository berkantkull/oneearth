"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { formatCoordinates } from "@/lib/coordinates";
import type { Light } from "@/types/light";
import { ShareLight } from "./share-light";

export function LightDetails({ light, onClose }: { light: Light; onClose: () => void }) {
  return (
    <motion.aside
      className="light-details glass-panel"
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10 }}
      aria-live="polite"
    >
      <button className="icon-button close-detail" onClick={onClose} aria-label="Close light details"><X size={17} /></button>
      <p className="eyebrow">A light from Earth</p>
      <p className="light-word">{light.word}</p>
      <div className="detail-meta">
        <span>{formatCoordinates(light.latitude, light.longitude)}</span>
        <span>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(light.createdAt))}</span>
      </div>
      <ShareLight id={light.id} />
    </motion.aside>
  );
}
