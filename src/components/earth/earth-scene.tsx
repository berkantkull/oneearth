"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { latLonToVector3 } from "@/lib/coordinates";
import type { Light } from "@/types/light";
import { EarthGlobe } from "./earth-globe";
import { LightMarkers } from "./light-markers";

type Props = {
  lights: Light[];
  selected: Light | null;
  selecting: boolean;
  reducedMotion: boolean;
  onSelect: (light: Light) => void;
  onLocationPick: (latitude: number, longitude: number) => void;
};

function CameraFocus({ selected }: { selected: Light | null }) {
  const { camera } = useThree();
  const target = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!selected) return;
    const point = latLonToVector3(selected.latitude, selected.longitude, 5.1);
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

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.25, 5.1], fov: 42, near: 0.1, far: 100 }}
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
      </Suspense>
      <CameraFocus selected={props.selected} />
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        minDistance={3.25}
        maxDistance={7}
        rotateSpeed={0.48}
        autoRotate={!props.reducedMotion && !props.selecting && !props.selected}
        autoRotateSpeed={0.32}
      />
    </Canvas>
  );
}
