"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { latLonToVector3 } from "@/lib/coordinates";
import type { Light } from "@/types/light";
import type { Locale } from "@/lib/i18n";
import { EarthGlobe } from "./earth-globe";
import { LightMarkers } from "./light-markers";
import { CityLabels } from "./city-labels";

type Props = {
  lights: Light[];
  selected: Light | null;
  selecting: boolean;
  reducedMotion: boolean;
  locale: Locale;
  onSelect: (light: Light) => void;
  onLocationPick: (latitude: number, longitude: number) => void;
};

function CameraFocus({ selected }: { selected: Light | null }) {
  const { camera } = useThree();
  const target = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!selected) return;
    const point = latLonToVector3(selected.latitude, selected.longitude, 3);
    target.current = new THREE.Vector3(point.x, point.y, point.z);
  }, [selected]);

  useFrame(() => {
    if (!target.current) return;
    camera.position.lerp(target.current, 0.045);
    camera.lookAt(0, 0, 0);
    if (camera.position.distanceTo(target.current) < 0.015) target.current = null;
  });
  return null;
}

export default function EarthScene(props: Props) {
  const controls = useRef<OrbitControlsImpl>(null);

  function nudgeZoom(direction: "in" | "out") {
    const orbit = controls.current;
    if (!orbit) return;

    const offset = orbit.object.position.clone().sub(orbit.target);
    const change = direction === "in" ? -0.62 : 0.62;
    const distance = THREE.MathUtils.clamp(offset.length() + change, orbit.minDistance, orbit.maxDistance);
    orbit.object.position.copy(orbit.target).add(offset.setLength(distance));
    orbit.update();
  }

  return (
    <>
      <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.25, 5.1], fov: 42, near: 0.025, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x020306, 1);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      >
        <Suspense fallback={null}>
          <EarthGlobe selecting={props.selecting} onLocationPick={props.onLocationPick} />
          <LightMarkers lights={props.lights} selectedId={props.selected?.id ?? null} onSelect={props.onSelect} />
          <CityLabels locale={props.locale} />
        </Suspense>
        <CameraFocus selected={props.selected} />
        <OrbitControls
          ref={controls}
          enablePan={false}
          enableDamping
          dampingFactor={0.055}
          minDistance={2.42}
          maxDistance={7}
          rotateSpeed={0.48}
          zoomSpeed={0.72}
          autoRotate={!props.reducedMotion && !props.selecting && !props.selected}
          autoRotateSpeed={0.32}
        />
      </Canvas>
      <div className="globe-zoom-controls" aria-label={props.locale === "tr" ? "Dünya yakınlaştırma kontrolleri" : "Earth zoom controls"}>
        <button type="button" onClick={() => nudgeZoom("in")} aria-label={props.locale === "tr" ? "Dünyayı yakınlaştır" : "Zoom in on Earth"}>+</button>
        <span aria-hidden="true" />
        <button type="button" onClick={() => nudgeZoom("out")} aria-label={props.locale === "tr" ? "Dünyayı uzaklaştır" : "Zoom out from Earth"}>−</button>
      </div>
    </>
  );
}
