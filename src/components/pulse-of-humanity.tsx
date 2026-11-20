"use client";

import { Activity, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { HumanityPulseEntry } from "@/lib/humanity-pulse";
import type { Copy, Locale } from "@/lib/i18n";

type Props = {
  open: boolean;
  entries: HumanityPulseEntry[];
  status: "idle" | "loading" | "ready" | "error";
  locale: Locale;
  copy: Copy;
  onOpen: () => void;
  onClose: () => void;
};

export function PulseOfHumanity({ open, entries, status, locale, copy, onOpen, onClose }: Props) {
  return (
    <div className="pulse-dock">
      <button
        className={`pulse-trigger ${open ? "active" : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls="humanity-pulse-panel"
        onClick={open ? onClose : onOpen}
      >
        <span className="pulse-signal" aria-hidden="true"><Activity size={15} /></span>
        <span>{copy.pulseTitle}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            id="humanity-pulse-panel"
            className="pulse-panel glass-panel"
            aria-label={copy.pulseTitle}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pulse-panel-head">
              <div>
                <p className="eyebrow">{copy.pulseLive}</p>
                <h2>{copy.pulseTitle}</h2>
              </div>
              <button className="icon-button" type="button" onClick={onClose} aria-label={copy.pulseClose}>
                <X size={16} />
              </button>
            </div>
            <p className="pulse-intro">{copy.pulseIntro}</p>

            {status === "loading" && <div className="pulse-state"><span className="pulse-loader" />{copy.pulseLoading}</div>}
            {status === "error" && <div className="pulse-state pulse-error">{copy.pulseError}</div>}
            {status === "ready" && entries.length === 0 && <div className="pulse-state">{copy.pulseEmpty}</div>}
            {status === "ready" && entries.length > 0 && (
              <ol className="pulse-list">
                {entries.map((entry, index) => (
                  <li key={entry.word.toLocaleLowerCase("tr-TR")}>
                    <span className="pulse-rank">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{entry.word}</strong>
                    <span>{entry.count.toLocaleString(locale === "tr" ? "tr-TR" : "en-US")} {copy.pulseTimes}</span>
                  </li>
                ))}
              </ol>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
