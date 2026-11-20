"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { codePointLength, normalizeWord } from "@/lib/validation";
import { formatCoordinates } from "@/lib/coordinates";
import type { Light } from "@/types/light";
import type { Copy, Locale } from "@/lib/i18n";
import { cityName, nearestCity } from "@/data/cities";
import { createPublicLight, getPublicClientId } from "@/lib/client/public-lights";

type Props = {
  coordinates: { latitude: number; longitude: number } | null;
  persistence: "api" | "supabase" | "session";
  locale: Locale;
  copy: Copy;
  onClose: () => void;
  onChangeLocation: () => void;
  onCreated: (light: Light) => void;
};

export function LeaveLightDialog({ coordinates, persistence, locale, copy, onClose, onChangeLocation, onCreated }: Props) {
  const [word, setWord] = useState("");
  const [status, setStatus] = useState<"editing" | "submitting" | "success">("editing");
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Light | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  if (!coordinates) return null;
  const selectedCoordinates = coordinates;
  const selectedCity = nearestCity(coordinates.latitude, coordinates.longitude);

  const normalized = normalizeWord(word);
  const length = codePointLength(normalized);
  const valid = length >= 1 && length <= 24 && !/\s|[<>\p{Cc}]/u.test(normalized);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    setStatus("submitting"); setError("");
    try {
      if (persistence === "session") {
        const light: Light = {
          id: crypto.randomUUID(),
          word: normalized,
          latitude: selectedCoordinates.latitude,
          longitude: selectedCoordinates.longitude,
          createdAt: new Date().toISOString(),
        };
        setCreated(light); setStatus("success"); onCreated(light);
        return;
      }
      if (persistence === "supabase") {
        const light = await createPublicLight({ word: normalized, ...selectedCoordinates }, getPublicClientId());
        setCreated(light); setStatus("success"); onCreated(light);
        return;
      }
      const response = await fetch("/api/lights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: normalized, ...coordinates }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || copy.submitError);
      setCreated(result.light); setStatus("success"); onCreated(result.light);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.submitError);
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
          <button className="icon-button dialog-close" onClick={onClose} aria-label={copy.dialogClose}><X size={18} /></button>
          {status === "success" && created ? (
            <div className="success-state">
              <span className="success-icon"><Check size={25} /></span>
              <p className="eyebrow">{copy.remembers}</p>
              <h2 id="leave-title">{copy.joinedEarth}</h2>
              <p className="success-word">{created.word}</p>
              {persistence === "session" && <p className="demo-notice">{copy.demoWarning}</p>}
              <button className="primary-action dialog-action" onClick={onClose}>{copy.seeLight}</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="eyebrow">{copy.leaveLight}</p>
              <h2 id="leave-title">{copy.oneWordQuestion}</h2>
              <p className="dialog-copy">{copy.wordPrompt}</p>
              <div className="location-row">
                <span>
                  <MapPin size={15} />
                  <span className="location-copy">
                    {selectedCity && <strong>{cityName(selectedCity, locale)}</strong>}
                    <small>{formatCoordinates(coordinates.latitude, coordinates.longitude, locale)}</small>
                  </span>
                </span>
                <button type="button" onClick={onChangeLocation}>{copy.change}</button>
              </div>
              <label className="word-field">
                <span className="sr-only">{copy.oneWordQuestion}</span>
                <input
                  ref={inputRef}
                  value={word}
                  onChange={(event) => setWord(event.target.value)}
                  maxLength={48}
                  placeholder={copy.wordPlaceholder}
                  autoComplete="off"
                  aria-describedby="word-help"
                />
                <span className={length > 24 ? "over-limit" : ""}>{length}/24</span>
              </label>
              <p id="word-help" className="field-help">{copy.wordRule}</p>
              {error && <p className="form-error" role="alert">{error}</p>}
              <p className="privacy-note">{copy.privacy}</p>
              {persistence === "session" && <p className="demo-notice">{copy.demoWarning}</p>}
              <button className="primary-action dialog-action" disabled={!valid || status === "submitting"}>
                {status === "submitting" ? <LoaderCircle className="spin" size={17} /> : null}
                {status === "submitting" ? copy.placing : copy.placeLight}
              </button>
            </form>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
