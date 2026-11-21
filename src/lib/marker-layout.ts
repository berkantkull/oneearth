import type { Light } from "@/types/light";
import { latLonToVector3, type Vector3Like } from "./coordinates";

export type LightCluster = {
  key: string;
  position: Vector3Like;
  lights: Light[];
};

export type FlowerPetal = {
  light: Light;
  clusterKey: string;
  petalIndex: number;
  visibleCount: number;
  ring: 0 | 1;
  angle: number;
};

const LOCATION_PRECISION = 3;

export function lightLocationKey(light: Pick<Light, "latitude" | "longitude">) {
  return `${light.latitude.toFixed(LOCATION_PRECISION)}:${light.longitude.toFixed(LOCATION_PRECISION)}`;
}

export function clusterLightMarkers(lights: Light[], radius = 1.79): LightCluster[] {
  const groups = new Map<string, Light[]>();

  lights.forEach((light) => {
    const key = lightLocationKey(light);
    const group = groups.get(key) ?? [];
    group.push(light);
    groups.set(key, group);
  });

  return Array.from(groups, ([key, group]) => {
    const sorted = [...group].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
    const anchor = sorted[0];
    return {
      key,
      position: latLonToVector3(anchor.latitude, anchor.longitude, radius),
      lights: sorted,
    };
  });
}

function stableAngleOffset(key: string) {
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }
  return (hash % 360) * (Math.PI / 180);
}

export function layoutFlowerPetals(clusters: LightCluster[], maxPetals = 12): FlowerPetal[] {
  return clusters.flatMap((cluster) => {
    if (cluster.lights.length < 2) return [];

    const visibleLights = cluster.lights.slice(0, Math.max(0, maxPetals));
    const offset = stableAngleOffset(cluster.key);
    const innerCount = visibleLights.length > 8 ? Math.min(6, visibleLights.length) : visibleLights.length;

    return visibleLights.map((light, petalIndex) => {
      const ring: 0 | 1 = petalIndex < innerCount ? 0 : 1;
      const ringIndex = ring === 0 ? petalIndex : petalIndex - innerCount;
      const ringCount = ring === 0 ? innerCount : visibleLights.length - innerCount;

      return {
        light,
        clusterKey: cluster.key,
        petalIndex,
        visibleCount: visibleLights.length,
        ring,
        angle: offset + (ringIndex / ringCount) * Math.PI * 2 + (ring === 1 ? Math.PI / Math.max(1, ringCount) : 0),
      };
    });
  });
}
