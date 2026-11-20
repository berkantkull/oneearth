import { describe, expect, it } from "vitest";
import { GET, POST } from "./route";

describe("lights API", () => {
  it("rejects pagination above the public maximum", async () => {
    const response = await GET(new Request("http://localhost/api/lights?limit=500"));
    expect(response.status).toBe(400);
  });

  it("rejects malformed submissions", async () => {
    const response = await POST(new Request("http://localhost/api/lights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "two words", latitude: 0, longitude: 0 }),
    }));
    expect(response.status).toBe(400);
  });

  it("rejects oversized request bodies", async () => {
    const response = await POST(new Request("http://localhost/api/lights", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "4096" },
      body: "{}",
    }));
    expect(response.status).toBe(413);
  });
});
