"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Light, LightsPage } from "@/types/light";
import { messages, type Locale } from "@/lib/i18n";
import { ErrorBoundary } from "./error-boundary";
import { HeroOverlay } from "./hero-overlay";
import { LeaveLightDialog } from "./leave-light-dialog";
import { LightDetails } from "./light-details";
import { LoadingScene } from "./loading-scene";
import { LocationSearch } from "./location-search";
import { hasPublicLightsBackend, listPublicLights } from "@/lib/client/public-lights";

const EarthScene = dynamic(() => import("./earth/earth-scene"), { ssr: false, loading: LoadingScene });
const staticMode = process.env.NEXT_PUBLIC_STATIC_MODE === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const persistence = staticMode ? (hasPublicLightsBackend() ? "supabase" : "session") : "api";

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch { return false; }
}

export function OneEarthExperience({ initialLight = null }: { initialLight?: Light | null }) {
  const [lights, setLights] = useState<Light[]>(initialLight ? [initialLight] : []);
  const [count, setCount] = useState(initialLight ? 1 : 0);
  const [locale, setLocale] = useState<Locale>("tr");
  const [selected, setSelected] = useState<Light | null>(initialLight);
  const [selecting, setSelecting] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    const initialCheck = window.setTimeout(() => {
      setWebgl(detectWebGL());
      update();
    }, 0);
    media.addEventListener("change", update);
    return () => {
      window.clearTimeout(initialCheck);
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const restoreLocale = window.setTimeout(() => {
      const saved = window.localStorage.getItem("one-earth-locale");
      if (saved === "tr" || saved === "en") setLocale(saved);
    }, 0);
    return () => window.clearTimeout(restoreLocale);
  }, []);

  useEffect(() => {
    if (persistence === "session") return;
    if (persistence === "supabase") {
      let active = true;
      listPublicLights().then((result) => {
        if (!active) return;
        setLights(result.lights); setCount(result.count); setLoadError(false);
      }).catch(() => { if (active) setLoadError(true); });
      return () => { active = false; };
    }
    const controller = new AbortController();
    Promise.all([
      fetch("/api/lights?limit=200", { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("lights");
        return response.json() as Promise<LightsPage>;
      }),
      fetch("/api/stats", { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("stats");
        return response.json() as Promise<{ count: number; demo: boolean }>;
      }),
    ]).then(([page, stats]) => {
      setLights((current) => {
        const merged = new Map(page.lights.map((light) => [light.id, light]));
        current.forEach((light) => merged.set(light.id, light));
        return Array.from(merged.values());
      });
      setCount(stats.count); setLoadError(false);
    }).catch((error) => {
      if (error.name !== "AbortError") setLoadError(true);
    });
    return () => controller.abort();
  }, []);

  const copy = messages[locale];

  function changeLocale(next: Locale) {
    setLocale(next);
    window.localStorage.setItem("one-earth-locale", next);
    document.documentElement.lang = next;
  }

  const recentLights = useMemo(() => lights.slice(0, 12), [lights]);

  function selectLight(light: Light) {
    setSelected(light); setSelecting(false);
    const path = staticMode ? `${basePath}/?light=${light.id}` : `/light/${light.id}`;
    window.history.replaceState({}, "", path);
  }

  function clearSelection() {
    setSelected(null);
    window.history.replaceState({}, "", staticMode ? `${basePath}/` : "/");
  }

  function beginLeaving() {
    setSelected(null); setCoordinates(null); setSelecting(true);
  }

  function chooseLocation(latitude: number, longitude: number) {
    setCoordinates({ latitude, longitude }); setSelecting(false); setDialogOpen(true);
  }

  function handleCreated(light: Light) {
    setLights((current) => [light, ...current.filter((item) => item.id !== light.id)]);
    setCount((current) => current + 1);
    selectLight(light);
  }

  const fallback = (
    <div className="webgl-fallback">
      <div>
        <p className="eyebrow">{copy.fallbackEyebrow}</p>
        <h2>{copy.fallbackTitle}</h2>
        <p>{copy.fallbackCopy}</p>
      </div>
      <ul>{recentLights.map((light) => <li key={light.id}><button onClick={() => selectLight(light)}>{light.word}</button></li>)}</ul>
    </div>
  );

  return (
    <main className={`earth-experience ${selecting ? "is-selecting" : ""}`}>
      <div className="ambient-glow" aria-hidden="true" />
      <div className="scene-wrap" aria-label={locale === "tr" ? "Etkileşimli üç boyutlu Dünya" : "Interactive three-dimensional Earth"}>
        {webgl === null ? <LoadingScene /> : webgl ? (
          <ErrorBoundary fallback={fallback}>
            <EarthScene lights={lights} selected={selected} selecting={selecting} reducedMotion={reducedMotion} onSelect={selectLight} onLocationPick={chooseLocation} />
          </ErrorBoundary>
        ) : fallback}
      </div>

      <HeroOverlay count={count} selecting={selecting} locale={locale} copy={copy} onLocaleChange={changeLocale} onLeave={beginLeaving} onCancel={() => setSelecting(false)} />
      <LocationSearch locale={locale} copy={copy} onChoose={chooseLocation} />
      {loadError && <div className="connection-note" role="status">{copy.loadError}</div>}
      <AnimatePresence>{selected && !dialogOpen && <LightDetails key={selected.id} light={selected} locale={locale} copy={copy} onClose={clearSelection} />}</AnimatePresence>
      {dialogOpen && (
        <LeaveLightDialog coordinates={coordinates} persistence={persistence} locale={locale} copy={copy} onClose={() => { setDialogOpen(false); setCoordinates(null); }} onChangeLocation={() => { setDialogOpen(false); setCoordinates(null); setSelecting(true); }} onCreated={handleCreated} />
      )}
    </main>
  );
}
