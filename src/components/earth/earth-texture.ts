import * as THREE from "three";

type Point = [number, number];

const continents: Point[][] = [
  [[-168, 72], [-140, 70], [-125, 53], [-100, 50], [-82, 26], [-97, 15], [-117, 27], [-132, 50], [-168, 62]],
  [[-81, 12], [-66, 8], [-48, -5], [-38, -24], [-57, -55], [-71, -44], [-78, -16]],
  [[-18, 36], [5, 43], [28, 35], [52, 12], [40, -13], [27, -35], [12, -35], [-5, 5]],
  [[-10, 36], [15, 58], [44, 70], [87, 73], [150, 62], [174, 50], [142, 32], [116, 20], [106, 5], [78, 8], [59, 25], [38, 40], [18, 40]],
  [[112, -10], [154, -12], [153, -39], [130, -44], [113, -27]],
  [[-73, 83], [-20, 82], [-18, 63], [-46, 59], [-65, 68]],
  [[-180, -68], [-120, -76], [-40, -72], [20, -78], [100, -70], [180, -75], [180, -90], [-180, -90]],
];

const toCanvas = ([lon, lat]: Point, width: number, height: number): Point => [
  ((lon + 180) / 360) * width,
  ((90 - lat) / 180) * height,
];

export function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const ocean = context.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#172b43");
  ocean.addColorStop(0.52, "#0e1e30");
  ocean.addColorStop(1, "#091422");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(114, 182, 237, 0.055)";
  context.lineWidth = 1;
  for (let lon = -150; lon <= 180; lon += 30) {
    const [x] = toCanvas([lon, 0], canvas.width, canvas.height);
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = toCanvas([0, lat], canvas.width, canvas.height);
    context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke();
  }

  for (const continent of continents) {
    context.beginPath();
    continent.forEach((point, index) => {
      const [x, y] = toCanvas(point, canvas.width, canvas.height);
      if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
    });
    context.closePath();
    const land = context.createLinearGradient(0, 220, 0, 820);
    land.addColorStop(0, "#253b42");
    land.addColorStop(0.5, "#1b3237");
    land.addColorStop(1, "#13272d");
    context.fillStyle = land;
    context.fill();
    context.strokeStyle = "rgba(128, 181, 186, 0.24)";
    context.lineWidth = 2;
    context.stroke();
  }

  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < image.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 6;
    image.data[i] += noise; image.data[i + 1] += noise; image.data[i + 2] += noise;
  }
  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
