import { describe, expect, it } from "vitest";
import type { Light } from "@/types/light";
import { latLonToVector3 } from "./coordinates";
import { clusterLightMarkers, lightLocationKey } from "./marker-layout";

function light(id: string, createdAt: string, latitude = 41.0082, longitude = 28.9784): Light {
  return { id, word: id, latitude, longitude, createdAt };
}

describe("marker clusters", () => {
  it("keeps a lone light on its exact coordinates", () => {
    const item = light("one", "2026-01-01T00:00:00.000Z");
    const [cluster] = clusterLightMarkers([item]);

    expect(cluster.position).toEqual(latLonToVector3(item.latitude, item.longitude, 1.79));
    expect(cluster.lights).toEqual([item]);
  });

  it("keeps every light at one real marker when coordinates match", () => {
    const oldLight = light("old", "2026-01-01T00:00:00.000Z");
    const newLight = light("new", "2026-01-03T00:00:00.000Z");
    const [cluster] = clusterLightMarkers([oldLight, newLight]);

    expect(clusterLightMarkers([oldLight, newLight])).toHaveLength(1);
    expect(cluster.position).toEqual(latLonToVector3(oldLight.latitude, oldLight.longitude, 1.79));
    expect(cluster.lights.map((item) => item.id)).toEqual(["new", "old"]);
  });

  it("does not merge nearby but meaningfully different positions", () => {
    const clusters = clusterLightMarkers([
      light("one", "2026-01-01T00:00:00.000Z", 41.0082, 28.9784),
      light("two", "2026-01-02T00:00:00.000Z", 41.0122, 28.9784),
    ]);

    expect(clusters).toHaveLength(2);
  });

  it("uses a stable location key for sub-block coordinate noise", () => {
    expect(lightLocationKey({ latitude: 41.00821, longitude: 28.97839 }))
      .toBe(lightLocationKey({ latitude: 41.00824, longitude: 28.97836 }));
  });
});
