"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import type { Copy } from "@/lib/i18n";

export function ShareLight({ id, copy }: { id: string; copy: Copy }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const url = process.env.NEXT_PUBLIC_STATIC_MODE === "1"
      ? `${window.location.origin}${basePath}/?light=${id}`
      : `${window.location.origin}/light/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="quiet-button" onClick={handleCopy} type="button">
      {copied ? <Check size={15} /> : <Link2 size={15} />}
      {copied ? copy.copied : copy.copyLink}
    </button>
  );
}
