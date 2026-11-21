"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { clusterLightMarkers, layoutFlowerPetals } from "@/lib/marker-layout";
import type { Light } from "@/types/light";

type Props = { lights: Light[]; selectedId: string | null; onSelect: (light: Light) => void };

export function LightMarkers({ lights, selectedId, onSelect }: Props) {
  const coreMesh = useRef<THREE.InstancedMesh>(null);
  const petalMesh = useRef<THREE.InstancedMesh>(null);
  const bloomProgress = useRef(new Map<string, number>());
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const clusters = useMemo(() => clusterLightMarkers(lights), [lights]);
  const petals = useMemo(() => layoutFlowerPetals(clusters), [clusters]);
  const clustersByKey = useMemo(() => new Map(clusters.map((cluster) => [cluster.key, cluster])), [clusters]);
  const coreMaterial = useMemo(() => new THREE.ShaderMaterial({
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

  const petalMaterial = useMemo(() => new THREE.ShaderMaterial({
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
        vec2 p = (vUv - 0.5) * 2.0;
        p.y += 0.12;
        float leafDistance = length(vec2(p.x * 1.62, p.y * 0.84));
        float body = 1.0 - smoothstep(0.68, 1.0, leafDistance + abs(p.x) * 0.16);
        float softCore = 1.0 - smoothstep(0.0, 0.72, leafDistance);
        float vein = exp(-abs(p.x) * 18.0) * (1.0 - smoothstep(-0.82, 0.75, p.y));
        float alpha = clamp(body * 0.72 + softCore * 0.42 + vein * 0.22, 0.0, 1.0);
        if (alpha < 0.025) discard;
        vec3 amber = vec3(0.94, 0.55, 0.16);
        vec3 ivory = vec3(1.0, 0.94, 0.72);
        vec3 color = mix(amber, ivory, softCore * 0.86 + vein * 0.38);
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
    coreMesh.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    petalMesh.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    return () => {
      coreMaterial.dispose();
      petalMaterial.dispose();
    };
  }, [coreMaterial, petalMaterial]);

  useFrame(({ clock, camera }) => {
    if (!coreMesh.current) return;
    const time = clock.getElapsedTime();
    clusters.forEach(({ key, position, lights: clusterLights }, index) => {
      const selected = clusterLights.some((light) => light.id === selectedId);
      const currentBloom = bloomProgress.current.get(key) ?? 0;
      bloomProgress.current.set(key, THREE.MathUtils.lerp(currentBloom, selected ? 1 : 0, 0.09));
      const pulse = 1 + Math.sin(time * 1.65 + index * 0.73) * 0.08;
      const clusteredScale = clusterLights.length > 1 ? 0.11 : 0.145;
      const scale = (selected ? (clusterLights.length > 1 ? 0.145 : 0.23) : clusteredScale) * pulse;
      dummy.position.set(position.x, position.y, position.z);
      dummy.quaternion.copy(camera.quaternion);
      dummy.scale.set(scale, scale, 1);
      dummy.updateMatrix();
      coreMesh.current!.setMatrixAt(index, dummy.matrix);
    });
    coreMesh.current.instanceMatrix.needsUpdate = true;

    if (!petalMesh.current) return;
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);

    petals.forEach((petal, index) => {
      const cluster = clustersByKey.get(petal.clusterKey);
      if (!cluster) return;
      const bloom = bloomProgress.current.get(petal.clusterKey) ?? 0;

      const ringFactor = petal.ring === 0 ? 1 : 1.55;
      const radius = THREE.MathUtils.lerp(0.068, 0.17, bloom) * ringFactor;
      const stagger = 1 + Math.sin(time * 1.4 + petal.petalIndex * 1.7) * 0.035;
      const isSelectedPetal = petal.light.id === selectedId;
      const petalScale = THREE.MathUtils.lerp(0.066, 0.105, bloom) * (isSelectedPetal ? 1.16 : 1) * stagger;
      const x = Math.cos(petal.angle) * radius;
      const y = Math.sin(petal.angle) * radius;

      anchor.set(cluster.position.x, cluster.position.y, cluster.position.z);
      dummy.position.copy(anchor).addScaledVector(right, x).addScaledVector(up, y);
      dummy.quaternion.copy(camera.quaternion);
      dummy.rotateZ(petal.angle - Math.PI / 2);
      dummy.scale.set(petalScale * 0.78, petalScale * 1.34, 1);
      dummy.updateMatrix();
      petalMesh.current!.setMatrixAt(index, dummy.matrix);
    });
    petalMesh.current.instanceMatrix.needsUpdate = true;
  });

  function handleCoreClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const light = clusters[event.instanceId]?.lights[0];
    if (light) onSelect(light);
  }

  function handlePetalClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const light = petals[event.instanceId]?.light;
    if (light) onSelect(light);
  }

  return (
    <>
      <instancedMesh ref={coreMesh} args={[undefined, undefined, clusters.length]} material={coreMaterial} onClick={handleCoreClick} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
      {petals.length > 0 ? (
        <instancedMesh ref={petalMesh} args={[undefined, undefined, petals.length]} material={petalMaterial} onClick={handlePetalClick} frustumCulled={false}>
          <planeGeometry args={[1, 1]} />
        </instancedMesh>
      ) : null}
    </>
  );
}
