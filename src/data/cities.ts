import type { Locale } from "@/lib/i18n";

export type City = {
  id: string;
  tr: string;
  en: string;
  latitude: number;
  longitude: number;
  tier: 1 | 2 | 3;
};

export const cities: City[] = [
  { id: "istanbul", tr: "İstanbul", en: "Istanbul", latitude: 41.0082, longitude: 28.9784, tier: 1 },
  { id: "ankara", tr: "Ankara", en: "Ankara", latitude: 39.9334, longitude: 32.8597, tier: 1 },
  { id: "izmir", tr: "İzmir", en: "Izmir", latitude: 38.4237, longitude: 27.1428, tier: 2 },
  { id: "antalya", tr: "Antalya", en: "Antalya", latitude: 36.8969, longitude: 30.7133, tier: 2 },
  { id: "bursa", tr: "Bursa", en: "Bursa", latitude: 40.195, longitude: 29.06, tier: 2 },
  { id: "adana", tr: "Adana", en: "Adana", latitude: 36.9914, longitude: 35.3308, tier: 2 },
  { id: "gaziantep", tr: "Gaziantep", en: "Gaziantep", latitude: 37.0662, longitude: 37.3833, tier: 2 },
  { id: "diyarbakir", tr: "Diyarbakır", en: "Diyarbakir", latitude: 37.9144, longitude: 40.2306, tier: 2 },
  { id: "konya", tr: "Konya", en: "Konya", latitude: 37.8746, longitude: 32.4932, tier: 3 },
  { id: "kayseri", tr: "Kayseri", en: "Kayseri", latitude: 38.7225, longitude: 35.4875, tier: 3 },
  { id: "mersin", tr: "Mersin", en: "Mersin", latitude: 36.8121, longitude: 34.6415, tier: 3 },
  { id: "samsun", tr: "Samsun", en: "Samsun", latitude: 41.2867, longitude: 36.33, tier: 3 },
  { id: "trabzon", tr: "Trabzon", en: "Trabzon", latitude: 41.0027, longitude: 39.7168, tier: 3 },
  { id: "erzurum", tr: "Erzurum", en: "Erzurum", latitude: 39.9043, longitude: 41.2679, tier: 3 },
  { id: "eskisehir", tr: "Eskişehir", en: "Eskisehir", latitude: 39.7767, longitude: 30.5206, tier: 3 },
  { id: "london", tr: "Londra", en: "London", latitude: 51.5072, longitude: -0.1276, tier: 1 },
  { id: "paris", tr: "Paris", en: "Paris", latitude: 48.8566, longitude: 2.3522, tier: 1 },
  { id: "berlin", tr: "Berlin", en: "Berlin", latitude: 52.52, longitude: 13.405, tier: 1 },
  { id: "rome", tr: "Roma", en: "Rome", latitude: 41.9028, longitude: 12.4964, tier: 1 },
  { id: "madrid", tr: "Madrid", en: "Madrid", latitude: 40.4168, longitude: -3.7038, tier: 1 },
  { id: "moscow", tr: "Moskova", en: "Moscow", latitude: 55.7558, longitude: 37.6173, tier: 1 },
  { id: "athens", tr: "Atina", en: "Athens", latitude: 37.9838, longitude: 23.7275, tier: 2 },
  { id: "vienna", tr: "Viyana", en: "Vienna", latitude: 48.2082, longitude: 16.3738, tier: 2 },
  { id: "amsterdam", tr: "Amsterdam", en: "Amsterdam", latitude: 52.3676, longitude: 4.9041, tier: 2 },
  { id: "brussels", tr: "Brüksel", en: "Brussels", latitude: 50.8503, longitude: 4.3517, tier: 2 },
  { id: "warsaw", tr: "Varşova", en: "Warsaw", latitude: 52.2297, longitude: 21.0122, tier: 2 },
  { id: "kyiv", tr: "Kıyiv", en: "Kyiv", latitude: 50.4501, longitude: 30.5234, tier: 2 },
  { id: "stockholm", tr: "Stockholm", en: "Stockholm", latitude: 59.3293, longitude: 18.0686, tier: 2 },
  { id: "cairo", tr: "Kahire", en: "Cairo", latitude: 30.0444, longitude: 31.2357, tier: 1 },
  { id: "lagos", tr: "Lagos", en: "Lagos", latitude: 6.5244, longitude: 3.3792, tier: 1 },
  { id: "johannesburg", tr: "Johannesburg", en: "Johannesburg", latitude: -26.2041, longitude: 28.0473, tier: 1 },
  { id: "casablanca", tr: "Kazablanka", en: "Casablanca", latitude: 33.5731, longitude: -7.5898, tier: 2 },
  { id: "nairobi", tr: "Nairobi", en: "Nairobi", latitude: -1.2921, longitude: 36.8219, tier: 2 },
  { id: "addis", tr: "Addis Ababa", en: "Addis Ababa", latitude: 8.9806, longitude: 38.7578, tier: 2 },
  { id: "capetown", tr: "Cape Town", en: "Cape Town", latitude: -33.9249, longitude: 18.4241, tier: 2 },
  { id: "newyork", tr: "New York", en: "New York", latitude: 40.7128, longitude: -74.006, tier: 1 },
  { id: "mexicocity", tr: "Meksiko", en: "Mexico City", latitude: 19.4326, longitude: -99.1332, tier: 1 },
  { id: "saopaulo", tr: "São Paulo", en: "São Paulo", latitude: -23.5505, longitude: -46.6333, tier: 1 },
  { id: "buenosaires", tr: "Buenos Aires", en: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, tier: 1 },
  { id: "losangeles", tr: "Los Angeles", en: "Los Angeles", latitude: 34.0522, longitude: -118.2437, tier: 1 },
  { id: "toronto", tr: "Toronto", en: "Toronto", latitude: 43.6532, longitude: -79.3832, tier: 1 },
  { id: "chicago", tr: "Chicago", en: "Chicago", latitude: 41.8781, longitude: -87.6298, tier: 2 },
  { id: "miami", tr: "Miami", en: "Miami", latitude: 25.7617, longitude: -80.1918, tier: 2 },
  { id: "vancouver", tr: "Vancouver", en: "Vancouver", latitude: 49.2827, longitude: -123.1207, tier: 2 },
  { id: "lima", tr: "Lima", en: "Lima", latitude: -12.0464, longitude: -77.0428, tier: 2 },
  { id: "bogota", tr: "Bogotá", en: "Bogotá", latitude: 4.711, longitude: -74.0721, tier: 2 },
  { id: "santiago", tr: "Santiago", en: "Santiago", latitude: -33.4489, longitude: -70.6693, tier: 2 },
  { id: "rio", tr: "Rio de Janeiro", en: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729, tier: 2 },
  { id: "tokyo", tr: "Tokyo", en: "Tokyo", latitude: 35.6762, longitude: 139.6503, tier: 1 },
  { id: "beijing", tr: "Pekin", en: "Beijing", latitude: 39.9042, longitude: 116.4074, tier: 1 },
  { id: "shanghai", tr: "Şanghay", en: "Shanghai", latitude: 31.2304, longitude: 121.4737, tier: 1 },
  { id: "delhi", tr: "Delhi", en: "Delhi", latitude: 28.6139, longitude: 77.209, tier: 1 },
  { id: "mumbai", tr: "Mumbai", en: "Mumbai", latitude: 19.076, longitude: 72.8777, tier: 1 },
  { id: "jakarta", tr: "Cakarta", en: "Jakarta", latitude: -6.2088, longitude: 106.8456, tier: 1 },
  { id: "seoul", tr: "Seul", en: "Seoul", latitude: 37.5665, longitude: 126.978, tier: 1 },
  { id: "dubai", tr: "Dubai", en: "Dubai", latitude: 25.2048, longitude: 55.2708, tier: 1 },
  { id: "singapore", tr: "Singapur", en: "Singapore", latitude: 1.3521, longitude: 103.8198, tier: 1 },
  { id: "osaka", tr: "Osaka", en: "Osaka", latitude: 34.6937, longitude: 135.5023, tier: 2 },
  { id: "bangkok", tr: "Bangkok", en: "Bangkok", latitude: 13.7563, longitude: 100.5018, tier: 2 },
  { id: "hanoi", tr: "Hanoi", en: "Hanoi", latitude: 21.0278, longitude: 105.8342, tier: 2 },
  { id: "manila", tr: "Manila", en: "Manila", latitude: 14.5995, longitude: 120.9842, tier: 2 },
  { id: "kualalumpur", tr: "Kuala Lumpur", en: "Kuala Lumpur", latitude: 3.139, longitude: 101.6869, tier: 2 },
  { id: "tehran", tr: "Tahran", en: "Tehran", latitude: 35.6892, longitude: 51.389, tier: 2 },
  { id: "baghdad", tr: "Bağdat", en: "Baghdad", latitude: 33.3152, longitude: 44.3661, tier: 2 },
  { id: "riyadh", tr: "Riyad", en: "Riyadh", latitude: 24.7136, longitude: 46.6753, tier: 2 },
  { id: "sydney", tr: "Sidney", en: "Sydney", latitude: -33.8688, longitude: 151.2093, tier: 1 },
  { id: "melbourne", tr: "Melbourne", en: "Melbourne", latitude: -37.8136, longitude: 144.9631, tier: 2 },
  { id: "auckland", tr: "Auckland", en: "Auckland", latitude: -36.8509, longitude: 174.7645, tier: 2 },
];

const EARTH_RADIUS_KM = 6371.0088;

export function nearestCity(latitude: number, longitude: number, maxDistanceKm = 220) {
  const radians = Math.PI / 180;
  let nearest: { city: City; distance: number } | null = null;
  for (const city of cities) {
    const deltaLat = (city.latitude - latitude) * radians;
    const deltaLon = (city.longitude - longitude) * radians;
    const a = Math.sin(deltaLat / 2) ** 2
      + Math.cos(latitude * radians) * Math.cos(city.latitude * radians) * Math.sin(deltaLon / 2) ** 2;
    const distance = 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
    if (distance <= maxDistanceKm && (!nearest || distance < nearest.distance)) nearest = { city, distance };
  }
  return nearest?.city ?? null;
}

export function cityName(city: City, locale: Locale) {
  return locale === "tr" ? city.tr : city.en;
}
