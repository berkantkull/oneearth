import { describe, expect, it } from "vitest";
import { lightShareUrl } from "./share-story";

describe("lightShareUrl", () => {
  it("creates a GitHub Pages deep link", () => {
    expect(lightShareUrl("https://example.com/", "abc 123", true, "/oneearth/"))
      .toBe("https://example.com/oneearth/?light=abc%20123");
  });

  it("creates a server route link", () => {
    expect(lightShareUrl("https://example.com", "abc", false))
      .toBe("https://example.com/light/abc");
  });
});
