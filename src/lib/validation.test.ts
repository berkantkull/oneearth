import { describe, expect, it } from "vitest";
import { lightInputSchema } from "./validation";

describe("light input validation", () => {
  it.each(["hope", "ışık", "光", "🌍", "café"])("accepts the single word %s", (word) => {
    expect(lightInputSchema.safeParse({ word, latitude: 0, longitude: 0 }).success).toBe(true);
  });

  it.each(["two words", "<script>", "", "a".repeat(25)])("rejects %s", (word) => {
    expect(lightInputSchema.safeParse({ word, latitude: 0, longitude: 0 }).success).toBe(false);
  });

  it("rejects out-of-range coordinates", () => {
    expect(lightInputSchema.safeParse({ word: "hope", latitude: 91, longitude: 0 }).success).toBe(false);
  });
});
