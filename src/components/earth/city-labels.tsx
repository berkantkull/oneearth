"use client";

import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { cities, cityName } from "@/data/cities";
import { latLonToVector3 } from "@/lib/coordinates";
import type { Locale } from "@/lib/i18n";

export function CityLabels({ locale }: { locale: Locale }) {
  const [visibleTier, setVisibleTier] = useState(0);
  const currentTier = useRef(0);

  useFrame(({ camera }) => {
    const distance = camera.position.length();
    const nextTier = distance < 2.5 ? 3 : distance < 2.95 ? 2 : distance < 3.55 ? 1 : 0;
    if (nextTier !== currentTier.current) {
      currentTier.current = nextTier;
      setVisibleTier(nextTier);
    }
  });

  if (visibleTier === 0) return null;

  return (
    <group>
      {cities.filter((city) => city.tier <= visibleTier).map((city) => {
        const position = latLonToVector3(city.latitude, city.longitude, 1.755);
        return (
          <Html
            key={city.id}
            position={[position.x, position.y, position.z]}
            center
            occlude
            pointerEvents="none"
            wrapperClass="city-label-wrap"
            zIndexRange={[24, 0]}
          >
            <span className={`city-label city-label-tier-${city.tier}`}>
              <i aria-hidden="true" />
              {cityName(city, locale)}
            </span>
          </Html>
        );
      })}
    </group>
  );
}
