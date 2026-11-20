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
  { id: "adiyaman", tr: "Adıyaman", en: "Adiyaman", latitude: 37.7648, longitude: 38.2786, tier: 3 },
  { id: "afyonkarahisar", tr: "Afyonkarahisar", en: "Afyonkarahisar", latitude: 38.7507, longitude: 30.5567, tier: 3 },
  { id: "agri", tr: "Ağrı", en: "Agri", latitude: 39.7191, longitude: 43.0503, tier: 3 },
  { id: "aksaray", tr: "Aksaray", en: "Aksaray", latitude: 38.3687, longitude: 34.037, tier: 3 },
  { id: "amasya", tr: "Amasya", en: "Amasya", latitude: 40.6499, longitude: 35.8353, tier: 3 },
  { id: "ardahan", tr: "Ardahan", en: "Ardahan", latitude: 41.1105, longitude: 42.7022, tier: 3 },
  { id: "artvin", tr: "Artvin", en: "Artvin", latitude: 41.1828, longitude: 41.8183, tier: 3 },
  { id: "aydin", tr: "Aydın", en: "Aydin", latitude: 37.845, longitude: 27.8396, tier: 3 },
  { id: "balikesir", tr: "Balıkesir", en: "Balikesir", latitude: 39.6484, longitude: 27.8826, tier: 3 },
  { id: "bartin", tr: "Bartın", en: "Bartin", latitude: 41.6344, longitude: 32.3375, tier: 3 },
  { id: "batman", tr: "Batman", en: "Batman", latitude: 37.8812, longitude: 41.1351, tier: 3 },
  { id: "bayburt", tr: "Bayburt", en: "Bayburt", latitude: 40.2552, longitude: 40.2249, tier: 3 },
  { id: "bilecik", tr: "Bilecik", en: "Bilecik", latitude: 40.0567, longitude: 30.0665, tier: 3 },
  { id: "bingol", tr: "Bingöl", en: "Bingol", latitude: 38.8853, longitude: 40.4983, tier: 3 },
  { id: "bitlis", tr: "Bitlis", en: "Bitlis", latitude: 38.3938, longitude: 42.1232, tier: 3 },
  { id: "bolu", tr: "Bolu", en: "Bolu", latitude: 40.735, longitude: 31.606, tier: 3 },
  { id: "burdur", tr: "Burdur", en: "Burdur", latitude: 37.7203, longitude: 30.2908, tier: 3 },
  { id: "canakkale", tr: "Çanakkale", en: "Canakkale", latitude: 40.1553, longitude: 26.4142, tier: 3 },
  { id: "cankiri", tr: "Çankırı", en: "Cankiri", latitude: 40.6013, longitude: 33.6134, tier: 3 },
  { id: "corum", tr: "Çorum", en: "Corum", latitude: 40.5506, longitude: 34.9556, tier: 3 },
  { id: "denizli", tr: "Denizli", en: "Denizli", latitude: 37.7765, longitude: 29.0864, tier: 3 },
  { id: "duzce", tr: "Düzce", en: "Duzce", latitude: 40.8438, longitude: 31.1565, tier: 3 },
  { id: "edirne", tr: "Edirne", en: "Edirne", latitude: 41.6771, longitude: 26.5557, tier: 3 },
  { id: "elazig", tr: "Elazığ", en: "Elazig", latitude: 38.6748, longitude: 39.2225, tier: 3 },
  { id: "erzincan", tr: "Erzincan", en: "Erzincan", latitude: 39.75, longitude: 39.5, tier: 3 },
  { id: "giresun", tr: "Giresun", en: "Giresun", latitude: 40.9128, longitude: 38.3895, tier: 3 },
  { id: "gumushane", tr: "Gümüşhane", en: "Gumushane", latitude: 40.4603, longitude: 39.4814, tier: 3 },
  { id: "hakkari", tr: "Hakkâri", en: "Hakkari", latitude: 37.5744, longitude: 43.7408, tier: 3 },
  { id: "hatay", tr: "Hatay", en: "Hatay", latitude: 36.2021, longitude: 36.1604, tier: 3 },
  { id: "igdir", tr: "Iğdır", en: "Igdir", latitude: 39.9237, longitude: 44.045, tier: 3 },
  { id: "isparta", tr: "Isparta", en: "Isparta", latitude: 37.7648, longitude: 30.5566, tier: 3 },
  { id: "kahramanmaras", tr: "Kahramanmaraş", en: "Kahramanmaras", latitude: 37.5753, longitude: 36.9228, tier: 3 },
  { id: "karabuk", tr: "Karabük", en: "Karabuk", latitude: 41.2061, longitude: 32.6204, tier: 3 },
  { id: "karaman", tr: "Karaman", en: "Karaman", latitude: 37.181, longitude: 33.215, tier: 3 },
  { id: "kars", tr: "Kars", en: "Kars", latitude: 40.6013, longitude: 43.0975, tier: 3 },
  { id: "kastamonu", tr: "Kastamonu", en: "Kastamonu", latitude: 41.3887, longitude: 33.7827, tier: 3 },
  { id: "kirikkale", tr: "Kırıkkale", en: "Kirikkale", latitude: 39.8468, longitude: 33.5153, tier: 3 },
  { id: "kirklareli", tr: "Kırklareli", en: "Kirklareli", latitude: 41.7351, longitude: 27.2252, tier: 3 },
  { id: "kirsehir", tr: "Kırşehir", en: "Kirsehir", latitude: 39.1425, longitude: 34.1709, tier: 3 },
  { id: "kilis", tr: "Kilis", en: "Kilis", latitude: 36.7184, longitude: 37.1212, tier: 3 },
  { id: "kocaeli", tr: "Kocaeli", en: "Kocaeli", latitude: 40.7654, longitude: 29.9408, tier: 3 },
  { id: "kutahya", tr: "Kütahya", en: "Kutahya", latitude: 39.4242, longitude: 29.9833, tier: 3 },
  { id: "malatya", tr: "Malatya", en: "Malatya", latitude: 38.3552, longitude: 38.3095, tier: 3 },
  { id: "manisa", tr: "Manisa", en: "Manisa", latitude: 38.6191, longitude: 27.4289, tier: 3 },
  { id: "mardin", tr: "Mardin", en: "Mardin", latitude: 37.3212, longitude: 40.7245, tier: 3 },
  { id: "mugla", tr: "Muğla", en: "Mugla", latitude: 37.2153, longitude: 28.3636, tier: 3 },
  { id: "mus", tr: "Muş", en: "Mus", latitude: 38.9462, longitude: 41.7539, tier: 3 },
  { id: "nevsehir", tr: "Nevşehir", en: "Nevsehir", latitude: 38.6244, longitude: 34.7239, tier: 3 },
  { id: "nigde", tr: "Niğde", en: "Nigde", latitude: 37.9698, longitude: 34.6766, tier: 3 },
  { id: "ordu", tr: "Ordu", en: "Ordu", latitude: 40.9839, longitude: 37.8764, tier: 3 },
  { id: "osmaniye", tr: "Osmaniye", en: "Osmaniye", latitude: 37.0742, longitude: 36.2478, tier: 3 },
  { id: "rize", tr: "Rize", en: "Rize", latitude: 41.0201, longitude: 40.5234, tier: 3 },
  { id: "sakarya", tr: "Sakarya", en: "Sakarya", latitude: 40.7569, longitude: 30.3781, tier: 3 },
  { id: "siirt", tr: "Siirt", en: "Siirt", latitude: 37.9333, longitude: 41.95, tier: 3 },
  { id: "sinop", tr: "Sinop", en: "Sinop", latitude: 42.0264, longitude: 35.1551, tier: 3 },
  { id: "sivas", tr: "Sivas", en: "Sivas", latitude: 39.75, longitude: 37.0167, tier: 3 },
  { id: "sanliurfa", tr: "Şanlıurfa", en: "Sanliurfa", latitude: 37.1674, longitude: 38.7955, tier: 3 },
  { id: "sirnak", tr: "Şırnak", en: "Sirnak", latitude: 37.4187, longitude: 42.4918, tier: 3 },
  { id: "tekirdag", tr: "Tekirdağ", en: "Tekirdag", latitude: 40.978, longitude: 27.511, tier: 3 },
  { id: "tokat", tr: "Tokat", en: "Tokat", latitude: 40.3167, longitude: 36.55, tier: 3 },
  { id: "tunceli", tr: "Tunceli", en: "Tunceli", latitude: 39.1079, longitude: 39.5401, tier: 3 },
  { id: "usak", tr: "Uşak", en: "Usak", latitude: 38.6823, longitude: 29.4082, tier: 3 },
  { id: "van", tr: "Van", en: "Van", latitude: 38.4942, longitude: 43.38, tier: 3 },
  { id: "yalova", tr: "Yalova", en: "Yalova", latitude: 40.65, longitude: 29.2667, tier: 3 },
  { id: "yozgat", tr: "Yozgat", en: "Yozgat", latitude: 39.8181, longitude: 34.8147, tier: 3 },
  { id: "zonguldak", tr: "Zonguldak", en: "Zonguldak", latitude: 41.4564, longitude: 31.7987, tier: 3 },
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

export function normalizeLocationQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ı/g, "i")
    .toLocaleLowerCase("en-US")
    .trim();
}

export function searchCities(query: string, limit = 6) {
  const normalized = normalizeLocationQuery(query);
  if (normalized.length < 2) return [];

  return cities
    .map((city) => {
      const names = [normalizeLocationQuery(city.tr), normalizeLocationQuery(city.en), city.id];
      const exact = names.some((name) => name === normalized);
      const startsWith = names.some((name) => name.startsWith(normalized));
      const includes = names.some((name) => name.includes(normalized));
      return { city, score: exact ? 0 : startsWith ? 1 : includes ? 2 : 99 };
    })
    .filter((result) => result.score < 99)
    .sort((a, b) => a.score - b.score || a.city.tr.localeCompare(b.city.tr, "tr"))
    .slice(0, limit)
    .map((result) => result.city);
}
