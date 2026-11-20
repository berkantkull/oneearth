export type Vector3Like = { x: number; y: number; z: number };

export function latLonToVector3(latitude: number, longitude: number, radius = 1): Vector3Like {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  const cosLat = Math.cos(lat);

  return {
    x: radius * cosLat * Math.cos(lon),
    y: radius * Math.sin(lat),
    z: -radius * cosLat * Math.sin(lon),
  };
}

export function vector3ToLatLon({ x, y, z }: Vector3Like) {
  const radius = Math.sqrt(x * x + y * y + z * z);
  if (radius === 0) return { latitude: 0, longitude: 0 };

  return {
    latitude: (Math.asin(y / radius) * 180) / Math.PI,
    longitude: (Math.atan2(-z, x) * 180) / Math.PI,
  };
}

export function formatCoordinates(latitude: number, longitude: number, locale: "tr" | "en" = "en") {
  const directions = locale === "tr" ? { north: "K", south: "G", east: "D", west: "B" } : { north: "N", south: "S", east: "E", west: "W" };
  const lat = `${Math.abs(latitude).toFixed(1)}°${latitude >= 0 ? directions.north : directions.south}`;
  const lon = `${Math.abs(longitude).toFixed(1)}°${longitude >= 0 ? directions.east : directions.west}`;
  return `${lat} · ${lon}`;
}
