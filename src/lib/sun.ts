const DEG = Math.PI / 180;

export function subsolarPoint(date: Date): { latitude: number; longitude: number } {
  const n = date.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545;
  const meanLongitude = (280.46 + 0.9856474 * n) % 360;
  const anomaly = ((357.528 + 0.9856003 * n) % 360) * DEG;
  const eclipticLongitude = (meanLongitude + 1.915 * Math.sin(anomaly) + 0.02 * Math.sin(2 * anomaly)) * DEG;
  const obliquity = (23.439 - 0.0000004 * n) * DEG;
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude));
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(eclipticLongitude), Math.cos(eclipticLongitude));
  const siderealTime = (280.46061837 + 360.98564736629 * n) % 360;
  let longitude = rightAscension / DEG - siderealTime;
  longitude = ((((longitude + 180) % 360) + 360) % 360) - 180;
  return { latitude: declination / DEG, longitude };
}
