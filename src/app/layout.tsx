import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://berkantkull.github.io/oneearth"),
  title: { default: "ONE EARTH", template: "%s · ONE EARTH" },
  description: "Tek dünya. Milyonlarca ses. Dünya üzerinde bir kelimelik ışığını bırak.",
  authors: [{ name: "Berkant Kul" }],
  creator: "Berkant Kul",
  openGraph: {
    title: "ONE EARTH",
    description: "Buradaydın. Dünya bunu hatırlıyor.",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
