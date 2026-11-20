"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { StatsCounter } from "./stats-counter";

type Props = { count: number; demo: boolean; selecting: boolean; onLeave: () => void; onCancel: () => void };

export function HeroOverlay({ count, demo, selecting, onLeave, onCancel }: Props) {
  return (
    <div className="hero-overlay">
      <motion.header className="topbar" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Link className="wordmark" href="/" aria-label="One Earth home">
          <span className="planet-mark" aria-hidden="true"><i /></span>
          <span>ONE EARTH</span>
        </Link>
        <StatsCounter count={count} demo={demo} />
      </motion.header>

      <motion.div className="hero-copy" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }}>
        <p className="eyebrow">One planet. Millions of voices.</p>
        <h1>You were here.<br /><span>And the Earth remembers.</span></h1>
      </motion.div>

      <div className="bottom-instruction">
        <span className="line" />
        <span>{selecting ? "Tap the globe to choose your place" : "Drag to explore · Tap a light to listen"}</span>
      </div>

      <div className="primary-action-wrap">
        {selecting ? (
          <button className="secondary-action" onClick={onCancel} type="button">Cancel</button>
        ) : (
          <button className="primary-action" onClick={onLeave} type="button"><Plus size={17} />Leave your light</button>
        )}
      </div>
    </div>
  );
}
