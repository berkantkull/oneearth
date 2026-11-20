import type { Metadata } from "next";
import { OneEarthExperience } from "@/components/one-earth-experience";
import { getLight } from "@/lib/server/lights";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const light = await getLight(id);
    if (!light) return { title: "Light not found · ONE EARTH" };
    const title = `“${light.word}” · ONE EARTH`;
    const description = "One word, left as a light on our shared planet.";
    return { title, description, openGraph: { title, description, type: "website", images: ["/opengraph-image"] } };
  } catch { return { title: "ONE EARTH" }; }
}

export default async function LightPage({ params }: Props) {
  const { id } = await params;
  let light = null;
  try { light = await getLight(id); } catch { /* The client shell remains usable. */ }
  return <OneEarthExperience initialLight={light} />;
}
