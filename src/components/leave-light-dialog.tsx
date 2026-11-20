"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { codePointLength, normalizeWord } from "@/lib/validation";
import { formatCoordinates } from "@/lib/coordinates";
import type { Light } from "@/types/light";

type Props = {
  coordinates: { latitude: number; longitude: number } | null;
  demo: boolean;
  onClose: () => void;
  onChangeLocation: () => void;
  onCreated: (light: Light) => void;
};

export function LeaveLightDialog({ coordinates, demo, onClose, onChangeLocation, onCreated }: Props) {
  const [word, setWord] = useState("");
  const [status, setStatus] = useState<"editing" | "submitting" | "success">("editing");
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Light | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  if (!coordinates) return null;

  const normalized = normalizeWord(word);
  const length = codePointLength(normalized);
  const valid = length >= 1 && length <= 24 && !/\s|[<>\p{Cc}]/u.test(normalized);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    setStatus("submitting"); setError("");
    try {
      const response = await fetch("/api/lights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: normalized, ...coordinates }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your light could not be placed.");
      setCreated(result.light); setStatus("success"); onCreated(result.light);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your light could not be placed.");
      setStatus("editing");
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <AnimatePresence mode="wait">
        <motion.section
          key={status === "success" ? "success" : "form"}
          className="leave-dialog glass-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-title"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15 }}
        >
          <button className="icon-button dialog-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
          {status === "success" && created ? (
            <div className="success-state">
              <span className="success-icon"><Check size={25} /></span>
              <p className="eyebrow">The Earth remembers</p>
              <h2 id="leave-title">Your light is now<br />part of Earth.</h2>
              <p className="success-word">{created.word}</p>
              {demo && <p className="demo-notice">Demo mode: this light lives in your current view only and is not saved.</p>}
              <button className="primary-action dialog-action" onClick={onClose}>See your light</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="eyebrow">Leave your light</p>
              <h2 id="leave-title">What is your one word?</h2>
              <p className="dialog-copy">A feeling, a hope, a memory. One word that says you were here.</p>
              <div className="location-row">
                <span><MapPin size={15} />{formatCoordinates(coordinates.latitude, coordinates.longitude)}</span>
                <button type="button" onClick={onChangeLocation}>Change</button>
              </div>
              <label className="word-field">
                <span className="sr-only">Your one word</span>
                <input
                  ref={inputRef}
                  value={word}
                  onChange={(event) => setWord(event.target.value)}
                  maxLength={48}
                  placeholder="Your word"
                  autoComplete="off"
                  aria-describedby="word-help"
                />
                <span className={length > 24 ? "over-limit" : ""}>{length}/24</span>
              </label>
              <p id="word-help" className="field-help">One word · No spaces · Any language</p>
              {error && <p className="form-error" role="alert">{error}</p>}
              <p className="privacy-note">Your selected place and word will be public. We never request your precise GPS location.</p>
              {demo && <p className="demo-notice">Demo mode is active. New lights are not persisted.</p>}
              <button className="primary-action dialog-action" disabled={!valid || status === "submitting"}>
                {status === "submitting" ? <LoaderCircle className="spin" size={17} /> : null}
                {status === "submitting" ? "Placing your light" : "Place my light"}
              </button>
            </form>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
