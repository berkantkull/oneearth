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

function drawCover(context: CanvasRenderingContext2D, source: CanvasImageSource, sourceWidth: number, sourceHeight: number) {
  const scale = Math.max(1080 / sourceWidth, 1920 / sourceHeight);
  const width = 1080 / scale;
  const height = 1920 / scale;
  const x = (sourceWidth - width) / 2;
  const y = (sourceHeight - height) / 2;
  context.drawImage(source, x, y, width, height, 0, 0, 1080, 1920);
}

export async function createStoryImage(light: Light, locale: Locale, shareUrl: string, earthCanvas: HTMLCanvasElement) {
  if (!earthCanvas.width || !earthCanvas.height) throw new Error("EARTH_CANVAS_EMPTY");

  const snapshot = document.createElement("canvas");
  snapshot.width = earthCanvas.width;
  snapshot.height = earthCanvas.height;
  const snapshotContext = snapshot.getContext("2d");
  if (!snapshotContext) throw new Error("SNAPSHOT_CANVAS_NOT_AVAILABLE");
  snapshotContext.drawImage(earthCanvas, 0, 0);

  await document.fonts?.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("CANVAS_NOT_AVAILABLE");

  const sourceAspect = snapshot.width / snapshot.height;
  context.save();
  if (sourceAspect > .85) {
    context.filter = "blur(34px) brightness(.42) saturate(.82)";
    context.translate(540, 960);
    context.scale(1.12, 1.12);
    context.translate(-540, -960);
  }
  drawCover(context, snapshot, snapshot.width, snapshot.height);
  context.restore();

  if (sourceAspect > .85) {
    const frameWidth = 1080;
    const frameHeight = frameWidth / sourceAspect;
    const frameY = 250;
    context.fillStyle = "#020407";
    context.fillRect(0, frameY - 3, 1080, frameHeight + 6);
    context.drawImage(snapshot, 0, 0, snapshot.width, snapshot.height, 0, frameY, frameWidth, frameHeight);
    context.strokeStyle = "rgba(242,241,236,.22)";
    context.lineWidth = 2;
    context.strokeRect(1, frameY, 1078, frameHeight);
  }

  const shade = context.createLinearGradient(0, 0, 0, 1920);
  shade.addColorStop(0, "rgba(2,4,7,.48)");
  shade.addColorStop(.18, "rgba(2,4,7,0)");
  shade.addColorStop(.58, "rgba(2,4,7,.08)");
  shade.addColorStop(.74, "rgba(2,4,7,.78)");
  shade.addColorStop(1, "rgba(2,4,7,.98)");
  context.fillStyle = shade;
  context.fillRect(0, 0, 1080, 1920);

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

  context.textAlign = "center";
  const contentStart = sourceAspect > .85 ? 1105 : 1390;
  context.fillStyle = "#e9bd72";
  context.font = "600 22px Inter, sans-serif";
  context.letterSpacing = "6px";
  context.fillText(locale === "tr" ? "DÜNYA’DAN BİR IŞIK" : "A LIGHT FROM EARTH", 540, contentStart);
  context.letterSpacing = "0px";

  let wordSize = 142;
  do {
    context.font = `430 ${wordSize}px 'Space Grotesk Variable', sans-serif`;
    wordSize -= 4;
  } while (context.measureText(light.word).width > 900 && wordSize > 62);
  context.fillStyle = "#f2f1ec";
  context.fillText(light.word, 540, contentStart + 155);

  context.fillStyle = "rgba(210,218,222,.67)";
  context.font = "400 25px Inter, sans-serif";
  const coordinates = formatCoordinates(light.latitude, light.longitude, locale);
  const date = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(light.createdAt));
  context.fillText(`${coordinates}  ·  ${date}`, 540, contentStart + 220);

  context.strokeStyle = "rgba(242,241,236,.17)";
  context.beginPath();
  context.moveTo(110, contentStart + 325); context.lineTo(970, contentStart + 325);
  context.stroke();
  context.fillStyle = "rgba(242,241,236,.58)";
  context.font = "400 22px Inter, sans-serif";
  context.fillText(shareUrl.replace(/^https?:\/\//, ""), 540, contentStart + 385);
  context.fillStyle = "rgba(242,241,236,.35)";
  context.font = "400 19px Inter, sans-serif";
  context.fillText("© 2026 Berkant Kul", 540, contentStart + 447);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("STORY_EXPORT_FAILED")), "image/png");
  });
}
