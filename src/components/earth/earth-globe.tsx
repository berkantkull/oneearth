"use client";

import { useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { vector3ToLatLon } from "@/lib/coordinates";
import { createEarthTexture } from "./earth-texture";

type Props = {
  selecting: boolean;
  onLocationPick: (latitude: number, longitude: number) => void;
};

export function EarthGlobe({ selecting, onLocationPick }: Props) {
  const texture = useMemo(() => createEarthTexture(), []);
  const pointerStart = useRef({ x: 0, y: 0 });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (!selecting) return;
    const distance = Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y);
    if (distance > 7) return;
    event.stopPropagation();
    const point = event.point.clone().normalize();
    const { latitude, longitude } = vector3ToLatLon(point);
    onLocationPick(latitude, longitude);
  }

  return (
    <group>
      <mesh onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        <sphereGeometry args={[1.72, 96, 96]} />
        <meshStandardMaterial map={texture ?? undefined} roughness={0.84} metalness={0.02} />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[1.72, 72, 72]} />
        <meshPhongMaterial
          color="#72b6ed"
          transparent
          opacity={0.075}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1.72, 64, 64]} />
        <meshBasicMaterial
          color="#5ca9df"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
