"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { Copy, Locale } from "@/lib/i18n";
import { StatsCounter } from "./stats-counter";

type Props = {
  count: number; selecting: boolean; locale: Locale; copy: Copy;
  onLocaleChange: (locale: Locale) => void; onLeave: () => void; onCancel: () => void;
};

export function HeroOverlay({ count, selecting, locale, copy, onLocaleChange, onLeave, onCancel }: Props) {
  return (
    <div className="hero-overlay">
      <motion.header className="topbar" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Link className="wordmark" href="/" aria-label={copy.home}>
          <span className="planet-mark" aria-hidden="true"><i /></span>
          <span>ONE EARTH</span>
        </Link>
        <div className="topbar-tools">
          <StatsCounter count={count} locale={locale} copy={copy} />
          <div className="language-switch" aria-label="Dil / Language">
            <button className={locale === "tr" ? "active" : ""} onClick={() => onLocaleChange("tr")}>TR</button>
            <span>/</span>
            <button className={locale === "en" ? "active" : ""} onClick={() => onLocaleChange("en")}>EN</button>
          </div>
        </div>
      </motion.header>

      <motion.div className="hero-copy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }}>
        <p className="eyebrow">{copy.tagline}</p>
        <h1>{copy.titleLead}<br /><span>{copy.titleTail}</span></h1>
        {count === 0 && <p className="empty-invitation">{copy.empty}</p>}
      </motion.div>

      <div className="bottom-instruction">
        <span className="line" />
        <span>{selecting ? copy.choosePlace : copy.explore}</span>
      </div>

      <div className="primary-action-wrap">
        {selecting ? (
          <button className="secondary-action" onClick={onCancel} type="button">{copy.cancel}</button>
        ) : (
          <button className="primary-action" onClick={onLeave} type="button"><Plus size={17} />{copy.leaveLight}</button>
        )}
      </div>
      <p className="copyright">{copy.copyright}</p>
    </div>
  );
}
