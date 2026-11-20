import { formatCoordinates } from "@/lib/coordinates";
import type { Locale } from "@/lib/i18n";
import type { Light } from "@/types/light";

export function lightShareUrl(origin: string, id: string, staticMode: boolean, basePath = "") {
  const cleanOrigin = origin.replace(/\/$/, "");
  const cleanBasePath = basePath ? `/${basePath.replace(/^\/+|\/+$/g, "")}` : "";
  return staticMode
    ? `${cleanOrigin}${cleanBasePath}/?light=${encodeURIComponent(id)}`
    : `${cleanOrigin}/light/${encodeURIComponent(id)}`;
}

function hashSeed(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function seededRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function drawMarker(context: CanvasRenderingContext2D, x: number, y: number) {
  const glow = context.createRadialGradient(x, y, 0, x, y, 92);
  glow.addColorStop(0, "rgba(255,247,218,.98)");
  glow.addColorStop(.12, "rgba(243,189,99,.84)");
  glow.addColorStop(.38, "rgba(105,187,255,.3)");
  glow.addColorStop(1, "rgba(105,187,255,0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, 92, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "rgba(116,199,255,.88)";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(x, y, 39, 0, Math.PI * 2);
  context.stroke();

  context.strokeStyle = "rgba(255,244,214,.95)";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(x - 51, y); context.lineTo(x + 51, y);
  context.moveTo(x, y - 51); context.lineTo(x, y + 51);
  context.stroke();
  context.fillStyle = "#fff8df";
  context.beginPath();
  context.arc(x, y, 11, 0, Math.PI * 2);
  context.fill();
}

export async function createStoryImage(light: Light, locale: Locale, shareUrl: string) {
  await document.fonts?.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("CANVAS_NOT_AVAILABLE");

  const background = context.createLinearGradient(0, 0, 1080, 1920);
  background.addColorStop(0, "#03070d");
  background.addColorStop(.55, "#07111f");
  background.addColorStop(1, "#020407");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1920);

  const random = seededRandom(hashSeed(light.id));
  for (let index = 0; index < 150; index += 1) {
    const x = random() * 1080;
    const y = random() * 1500;
    const radius = .4 + random() * 1.6;
    context.fillStyle = `rgba(221,235,246,${.14 + random() * .42})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = "#f2f1ec";
  context.font = "600 29px 'Space Grotesk Variable', sans-serif";
  context.letterSpacing = "8px";
  context.fillText("ONE EARTH", 86, 112);
  context.letterSpacing = "0px";
  context.strokeStyle = "rgba(242,241,236,.22)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(55, 102, 19, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = "rgba(233,189,114,.85)";
  context.beginPath();
  context.ellipse(55, 102, 25, 8, -.42, 0, Math.PI * 2);
  context.stroke();

  const earthX = 540;
  const earthY = 835;
  const earthRadius = 420;
  context.save();
  context.shadowColor = "rgba(55,133,255,.42)";
  context.shadowBlur = 70;
  const earth = context.createRadialGradient(400, 650, 40, earthX, earthY, earthRadius);
  earth.addColorStop(0, "#284e78");
  earth.addColorStop(.36, "#102f52");
  earth.addColorStop(.72, "#07192e");
  earth.addColorStop(1, "#01060d");
  context.fillStyle = earth;
  context.beginPath();
  context.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.beginPath();
  context.arc(earthX, earthY, earthRadius - 2, 0, Math.PI * 2);
  context.clip();
  for (let index = 0; index < 210; index += 1) {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * earthRadius * .92;
    const x = earthX + Math.cos(angle) * distance;
    const y = earthY + Math.sin(angle) * distance;
    context.fillStyle = `rgba(233,189,114,${.06 + random() * .18})`;
    context.beginPath();
    context.arc(x, y, .7 + random() * 2.1, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  const latitude = light.latitude * Math.PI / 180;
  const viewOffset = -.42;
  const markerX = earthX + earthRadius * .72 * Math.cos(latitude) * Math.sin(viewOffset);
  const markerY = earthY - earthRadius * .72 * Math.sin(latitude);
  drawMarker(context, markerX, markerY);

  context.textAlign = "center";
  context.fillStyle = "#e9bd72";
  context.font = "600 22px Inter, sans-serif";
  context.letterSpacing = "6px";
  context.fillText(locale === "tr" ? "DÜNYA’DAN BİR IŞIK" : "A LIGHT FROM EARTH", 540, 1390);
  context.letterSpacing = "0px";

  let wordSize = 142;
  do {
    context.font = `430 ${wordSize}px 'Space Grotesk Variable', sans-serif`;
    wordSize -= 4;
  } while (context.measureText(light.word).width > 900 && wordSize > 62);
  context.fillStyle = "#f2f1ec";
  context.fillText(light.word, 540, 1545);

  context.fillStyle = "rgba(210,218,222,.67)";
  context.font = "400 25px Inter, sans-serif";
  const coordinates = formatCoordinates(light.latitude, light.longitude, locale);
  const date = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(light.createdAt));
  context.fillText(`${coordinates}  ·  ${date}`, 540, 1610);

  context.strokeStyle = "rgba(242,241,236,.17)";
  context.beginPath();
  context.moveTo(110, 1715); context.lineTo(970, 1715);
  context.stroke();
  context.fillStyle = "rgba(242,241,236,.58)";
  context.font = "400 22px Inter, sans-serif";
  context.fillText(shareUrl.replace(/^https?:\/\//, ""), 540, 1770);
  context.fillStyle = "rgba(242,241,236,.35)";
  context.font = "400 19px Inter, sans-serif";
  context.fillText("© 2026 Berkant Kul", 540, 1832);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("STORY_EXPORT_FAILED")), "image/png");
  });
}
