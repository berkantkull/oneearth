import type { Light } from "@/types/light";
import { latLonToVector3, type Vector3Like } from "./coordinates";

export type LightCluster = {
  key: string;
  position: Vector3Like;
  lights: Light[];
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
