"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function ShareLight({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/light/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="quiet-button" onClick={copy} type="button">
      {copied ? <Check size={15} /> : <Link2 size={15} />}
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
