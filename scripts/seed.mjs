import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the seed script.");
  process.exit(1);
}

const demoRows = [
  { word: "belong", latitude: 41.01, longitude: 28.97 },
  { word: "hope", latitude: -33.87, longitude: 151.21 },
  { word: "ubuntu", latitude: -33.93, longitude: 18.42 },
  { word: "amor", latitude: -23.55, longitude: -46.63 },
  { word: "光", latitude: 35.68, longitude: 139.69 },
];

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error } = await supabase.from("lights").insert(demoRows);
if (error) {
  console.error(error.message);
  process.exit(1);
}
console.log(`Inserted ${demoRows.length} clearly identified demo lights.`);
