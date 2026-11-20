import { describe, expect, it } from "vitest";
import { cities, cityName, nearestCity, searchCities } from "./cities";

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

describe("city search", () => {
  it("contains all 81 Turkish provinces before the world-city catalogue", () => {
    expect(cities.findIndex((city) => city.id === "london")).toBe(81);
  });

  it("finds Turkish provinces without requiring Turkish characters", () => {
    expect(searchCities("sanliurfa")[0]?.tr).toBe("Şanlıurfa");
    expect(searchCities("igdir")[0]?.tr).toBe("Iğdır");
  });

  it("finds English city names", () => {
    expect(searchCities("london")[0]?.id).toBe("london");
  });
});
