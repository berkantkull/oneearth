"use client";
/* eslint-disable react-hooks/immutability -- Three.js textures and shader uniforms are intentionally mutable GPU resources. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { vector3ToLatLon, latLonToVector3 } from "@/lib/coordinates";
import { subsolarPoint } from "@/lib/sun";
import { atmosphereFragment, atmosphereVertex, cloudFragment, earthFragment, earthVertex } from "./earth-shaders";

type Props = { selecting: boolean; onLocationPick: (latitude: number, longitude: number) => void };
const EARTH_RADIUS = 1.72;
const ATMOSPHERE_RADIUS = 1.91;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function EarthGlobe({ selecting, onLocationPick }: Props) {
  const [day, night, clouds, normal, specular, stars] = useTexture([
    `${basePath}/textures/earth_day_4k.webp`, `${basePath}/textures/earth_night_4k.webp`,
    `${basePath}/textures/earth_clouds_2k.webp`, `${basePath}/textures/earth_normal_2k.webp`,
    `${basePath}/textures/earth_specular_1k.webp`, `${basePath}/textures/stars_milky_way_2k.webp`,
  ]);
  const pointerStart = useRef({ x: 0, y: 0 });
  const sunDirection = useMemo(() => new THREE.Vector3(1, 0, 0), []);

  useEffect(() => {
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    stars.colorSpace = THREE.SRGBColorSpace;
    clouds.wrapS = THREE.RepeatWrapping;
    for (const texture of [day, night, clouds, normal, specular, stars]) texture.anisotropy = 8;
  }, [day, night, clouds, normal, specular, stars]);

  const earthMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      dayMap: { value: day }, nightMap: { value: night }, specularMap: { value: specular },
      normalMap: { value: normal }, cloudMap: { value: clouds }, sunDirection: { value: sunDirection },
      cloudOffset: { value: 0 },
    },
  }), [day, night, specular, normal, clouds, sunDirection]);

  const cloudMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: cloudFragment,
    uniforms: { cloudMap: { value: clouds }, sunDirection: { value: sunDirection }, cloudOffset: { value: 0 } },
    transparent: true,
    depthWrite: false,
  }), [clouds, sunDirection]);

  const atmosphereMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      sunDirection: { value: sunDirection },
      limbDot: { value: Math.sqrt(1 - (EARTH_RADIUS * EARTH_RADIUS) / (ATMOSPHERE_RADIUS * ATMOSPHERE_RADIUS)) },
    },
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [sunDirection]);

  useEffect(() => () => {
    earthMaterial.dispose();
    cloudMaterial.dispose();
    atmosphereMaterial.dispose();
  }, [earthMaterial, cloudMaterial, atmosphereMaterial]);

  useFrame(() => {
    const now = new Date();
    const sun = subsolarPoint(now);
    const vector = latLonToVector3(sun.latitude, sun.longitude);
    sunDirection.set(vector.x, vector.y, vector.z).normalize();
    const offset = ((now.getTime() / 1000 / 86_400) * 0.6) % 1;
    earthMaterial.uniforms.cloudOffset.value = offset;
    cloudMaterial.uniforms.cloudOffset.value = offset;
  });

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (!selecting || Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) > 7) return;
    event.stopPropagation();
    const point = event.point.clone().normalize();
    const { latitude, longitude } = vector3ToLatLon(point);
    onLocationPick(latitude, longitude);
  }

  return (
    <group>
      <mesh onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} material={earthMaterial}>
        <sphereGeometry args={[EARTH_RADIUS, 160, 80]} />
      </mesh>
      <mesh material={cloudMaterial}>
        <sphereGeometry args={[EARTH_RADIUS * 1.006, 128, 64]} />
      </mesh>
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, 96, 48]} />
      </mesh>
      <mesh scale={48}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial map={stars} side={THREE.BackSide} color="#4a5363" depthWrite={false} />
      </mesh>
    </group>
  );
}
