import type { Light } from "@/types/light";
import { latLonToVector3, type Vector3Like } from "./coordinates";

export type MarkerLayout = {
  position: Vector3Like;
  clusterSize: number;
};

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const CLUSTER_PRECISION = 2;

function clusterKey(light: Light) {
  return `${light.latitude.toFixed(CLUSTER_PRECISION)}:${light.longitude.toFixed(CLUSTER_PRECISION)}`;
}

function hashAngle(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) / 4294967296) * TAU;
}

function normalize(vector: Vector3Like): Vector3Like {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

function cross(a: Vector3Like, b: Vector3Like): Vector3Like {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function offsetOnGlobe(base: Vector3Like, slot: number, radius: number, startAngle: number): Vector3Like {
  if (slot === 0) return base;

  const normal = normalize(base);
  const reference = Math.abs(normal.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  const tangent = normalize(cross(reference, normal));
  const bitangent = normalize(cross(normal, tangent));
  const angle = startAngle + (slot - 1) * GOLDEN_ANGLE;
  const surfaceOffset = Math.min(0.105 * Math.sqrt(slot), 0.42);
  const angularOffset = surfaceOffset / radius;
  const direction = normalize({
    x: normal.x + angularOffset * (tangent.x * Math.cos(angle) + bitangent.x * Math.sin(angle)),
    y: normal.y + angularOffset * (tangent.y * Math.cos(angle) + bitangent.y * Math.sin(angle)),
    z: normal.z + angularOffset * (tangent.z * Math.cos(angle) + bitangent.z * Math.sin(angle)),
  });

  return { x: direction.x * radius, y: direction.y * radius, z: direction.z * radius };
}

export function layoutLightMarkers(lights: Light[], radius = 1.79): MarkerLayout[] {
  const groups = new Map<string, Array<{ light: Light; index: number }>>();

  lights.forEach((light, index) => {
    const key = clusterKey(light);
    const group = groups.get(key) ?? [];
    group.push({ light, index });
    groups.set(key, group);
  });

  const layouts = new Array<MarkerLayout>(lights.length);
  groups.forEach((group, key) => {
    group.sort((a, b) => a.light.createdAt.localeCompare(b.light.createdAt) || a.light.id.localeCompare(b.light.id));
    const startAngle = hashAngle(key);

    group.forEach(({ light, index }, slot) => {
      const base = latLonToVector3(light.latitude, light.longitude, radius);
      layouts[index] = {
        position: offsetOnGlobe(base, slot, radius, startAngle),
        clusterSize: group.length,
      };
    });
  });

  return layouts;
}
