"use client";

import { useState } from "react";
import { Check, Link2, LoaderCircle, Share2 } from "lucide-react";
import type { Copy, Locale } from "@/lib/i18n";
import type { Light } from "@/types/light";
import { createStoryImage, lightShareUrl } from "@/lib/share-story";

export function ShareLight({ light, locale, copy }: { light: Light; locale: Locale; copy: Copy }) {
  const [copied, setCopied] = useState(false);
  const [storyState, setStoryState] = useState<"idle" | "preparing" | "done">("idle");

  function getUrl() {
    return lightShareUrl(
      window.location.origin,
      light.id,
      process.env.NEXT_PUBLIC_STATIC_MODE === "1",
      process.env.NEXT_PUBLIC_BASE_PATH ?? "",
    );
  }

  async function handleCopy() {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleStoryShare() {
    setStoryState("preparing");
    try {
      const earthCanvas = document.querySelector<HTMLCanvasElement>(".scene-wrap canvas");
      if (!earthCanvas) throw new Error("EARTH_CANVAS_NOT_FOUND");
      earthCanvas.dispatchEvent(new Event("oneearth:capture"));
      const blob = await createStoryImage(light, locale, getUrl(), earthCanvas);
      const file = new File([blob], `one-earth-${light.id.slice(0, 8)}.png`, { type: "image/png" });
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobileDevice && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `“${light.word}” · ONE EARTH`,
          text: copy.storyShareText,
        });
      } else {
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = file.name;
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
      setStoryState("done");
      window.setTimeout(() => setStoryState("idle"), 2200);
    } catch {
      setStoryState("idle");
    }
  }

  return (
    <div className="share-actions">
      <button className="quiet-button" onClick={handleCopy} type="button">
        {copied ? <Check size={15} /> : <Link2 size={15} />}
        {copied ? copy.copied : copy.copyLink}
      </button>
      <button className="quiet-button story-button" onClick={handleStoryShare} type="button" disabled={storyState === "preparing"}>
        {storyState === "preparing" ? <LoaderCircle className="spin" size={15} /> : storyState === "done" ? <Check size={15} /> : <Share2 size={15} />}
        {storyState === "preparing" ? copy.storyPreparing : storyState === "done" ? copy.storyReady : copy.shareStory}
      </button>
    </div>
  );
}
