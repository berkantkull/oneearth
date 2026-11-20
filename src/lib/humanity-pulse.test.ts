import { describe, expect, it } from "vitest";
import { buildHumanityPulse } from "./humanity-pulse";

describe("humanity pulse", () => {
  it("shows only words shared by more than one person", () => {
    expect(buildHumanityPulse(["umut", "sevgi", "umut", "yalnız"])).toEqual([
      { word: "umut", count: 2 },
    ]);
  });

  it("combines casing and sorts by frequency", () => {
    expect(buildHumanityPulse(["Umut", "umut", "SEVGİ", "sevgi", "Sevgi", "barış", "barış"])).toEqual([
      { word: "SEVGİ", count: 3 },
      { word: "barış", count: 2 },
      { word: "Umut", count: 2 },
    ]);
  });

  it("limits the public pulse list", () => {
    expect(buildHumanityPulse(["a", "a", "b", "b", "c", "c"], 2)).toHaveLength(2);
  });
});
