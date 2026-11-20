export type Light = {
  id: string;
  word: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export type LightsPage = {
  lights: Light[];
  nextCursor: string | null;
  demo: boolean;
};

export type CreateLightInput = Pick<Light, "word" | "latitude" | "longitude">;
