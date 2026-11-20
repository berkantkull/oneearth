import { ImageResponse } from "next/og";

export const alt = "ONE EARTH — One planet. Millions of voices.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#05070b", color: "#f5f5f2", padding: "70px", fontFamily: "sans-serif" }}>
      <div style={{ position: "absolute", width: 570, height: 570, borderRadius: "50%", right: 70, top: 30, background: "radial-gradient(circle at 35% 30%, #315578 0%, #142337 46%, #08111d 72%)", boxShadow: "0 0 90px rgba(114,182,237,.28)" }} />
      <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", right: 350, top: 155, background: "#f3c47a", boxShadow: "0 0 24px #f3c47a" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 25, letterSpacing: 8 }}>ONE EARTH</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 18, letterSpacing: 4, color: "#f3c47a", textTransform: "uppercase" }}>One planet. Millions of voices.</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 1.05, marginTop: 22, maxWidth: 640 }}>
            <span>You were here.</span><span>And the Earth remembers.</span>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
