"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { layoutLightMarkers } from "@/lib/marker-layout";
import type { Light } from "@/types/light";

type Props = { lights: Light[]; selectedId: string | null; onSelect: (light: Light) => void };

export function LightMarkers({ lights, selectedId, onSelect }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const layouts = useMemo(() => layoutLightMarkers(lights), [lights]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vec2 point = (vUv - 0.5) * 2.0;
        float radius = length(point);
        float core = 1.0 - smoothstep(0.0, 0.18, radius);
        float halo = (1.0 - smoothstep(0.05, 1.0, radius)) * 0.28;
        float beaconRing = exp(-pow((radius - 0.46) * 20.0, 2.0)) * 0.56;
        float horizontal = exp(-abs(point.y) * 30.0) * (1.0 - smoothstep(0.08, 1.0, abs(point.x)));
        float vertical = exp(-abs(point.x) * 30.0) * (1.0 - smoothstep(0.08, 1.0, abs(point.y)));
        float rays = (horizontal + vertical) * 0.58;
        float alpha = clamp(core + halo + rays + beaconRing, 0.0, 1.0);
        if (alpha < 0.025) discard;
        vec3 warm = vec3(0.94, 0.62, 0.22);
        vec3 white = vec3(1.0, 0.96, 0.84);
        vec3 cool = vec3(0.42, 0.76, 1.0);
        vec3 color = mix(warm, white, clamp(core * 1.4 + rays * 0.55, 0.0, 1.0));
        color = mix(color, cool, beaconRing * 0.72);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
  }), []);

  useEffect(() => {
    mesh.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    return () => material.dispose();
  }, [material]);

  useFrame(({ clock, camera }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    layouts.forEach(({ position, clusterSize }, index) => {
      const selected = lights[index]?.id === selectedId;
      const pulse = 1 + Math.sin(time * 1.65 + index * 0.73) * 0.08;
      const scale = (selected ? 0.23 : clusterSize > 1 ? 0.112 : 0.145) * pulse;
      dummy.position.set(position.x, position.y, position.z);
      dummy.quaternion.copy(camera.quaternion);
      dummy.scale.set(scale, scale, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const light = lights[event.instanceId];
    if (light) onSelect(light);
  }

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, lights.length]} material={material} onClick={handleClick} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
    </instancedMesh>
  );
}
