import { describe, expect, it } from "vitest";
import { latLonToVector3, vector3ToLatLon } from "./coordinates";

describe("coordinate conversion", () => {
  it.each([
    [0, 0], [41.01, 28.97], [-33.87, 151.21], [89.9, -179.5],
  ])("round-trips latitude %s longitude %s", (latitude, longitude) => {
    const point = latLonToVector3(latitude, longitude, 1.75);
    const result = vector3ToLatLon(point);
    expect(result.latitude).toBeCloseTo(latitude, 6);
    expect(result.longitude).toBeCloseTo(longitude, 6);
  });

  it("places every point on the requested radius", () => {
    const point = latLonToVector3(12, 75, 2.4);
    expect(Math.hypot(point.x, point.y, point.z)).toBeCloseTo(2.4, 8);
  });
});
