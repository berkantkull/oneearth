import { describe, expect, it } from "vitest";
import { cityName, nearestCity } from "./cities";

describe("city lookup", () => {
  it("finds Istanbul for a nearby selected point", () => {
    const city = nearestCity(41.02, 29.01);
    expect(city?.id).toBe("istanbul");
    expect(city && cityName(city, "tr")).toBe("İstanbul");
  });

  it("does not claim a city for a remote ocean point", () => {
    expect(nearestCity(0, -145)).toBeNull();
  });
});
