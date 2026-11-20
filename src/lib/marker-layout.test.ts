import { describe, expect, it } from "vitest";
import type { Light } from "@/types/light";
import { latLonToVector3 } from "./coordinates";
import { layoutLightMarkers } from "./marker-layout";

function light(id: string, createdAt: string, latitude = 41.0082, longitude = 28.9784): Light {
  return { id, word: id, latitude, longitude, createdAt };
}

describe("marker layout", () => {
  it("keeps a lone light on its exact coordinates", () => {
    const item = light("one", "2026-01-01T00:00:00.000Z");
    const [layout] = layoutLightMarkers([item]);
    const expected = latLonToVector3(item.latitude, item.longitude, 1.79);

    expect(layout.position).toEqual(expected);
    expect(layout.clusterSize).toBe(1);
  });

  it("separates lights left at the same location on the globe surface", () => {
    const layouts = layoutLightMarkers([
      light("one", "2026-01-01T00:00:00.000Z"),
      light("two", "2026-01-02T00:00:00.000Z"),
      light("three", "2026-01-03T00:00:00.000Z"),
    ]);

    const uniquePositions = new Set(layouts.map(({ position }) => `${position.x}:${position.y}:${position.z}`));
    expect(uniquePositions.size).toBe(3);
    layouts.forEach(({ position, clusterSize }) => {
      expect(Math.hypot(position.x, position.y, position.z)).toBeCloseTo(1.79, 8);
      expect(clusterSize).toBe(3);
    });
  });

  it("does not move existing slots when a newer light is added", () => {
    const existing = [
      light("one", "2026-01-01T00:00:00.000Z"),
      light("two", "2026-01-02T00:00:00.000Z"),
    ];
    const before = layoutLightMarkers(existing);
    const after = layoutLightMarkers([...existing, light("three", "2026-01-03T00:00:00.000Z")]);

    expect(after[0].position).toEqual(before[0].position);
    expect(after[1].position).toEqual(before[1].position);
  });
});
