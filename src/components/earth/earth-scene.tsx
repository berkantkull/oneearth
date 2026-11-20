"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
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
      onCreated={({ gl }) => gl.setClearColor(0x05070b, 0)}
    >
      <ambientLight intensity={0.4} color="#7aa7c7" />
      <directionalLight position={[4, 2.5, 5]} intensity={2.2} color="#d6ecff" />
      <directionalLight position={[-3, -1, -4]} intensity={0.35} color="#356a9c" />
      <Stars radius={38} depth={30} count={props.reducedMotion ? 600 : 1300} factor={1.6} saturation={0.15} fade speed={0.18} />
      <EarthGlobe selecting={props.selecting} onLocationPick={props.onLocationPick} />
      <LightMarkers lights={props.lights} selectedId={props.selected?.id ?? null} onSelect={props.onSelect} />
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
