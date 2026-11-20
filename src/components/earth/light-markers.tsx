"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { latLonToVector3 } from "@/lib/coordinates";
import type { Light } from "@/types/light";

type Props = { lights: Light[]; selectedId: string | null; onSelect: (light: Light) => void };

export function LightMarkers({ lights, selectedId, onSelect }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => lights.map((light) => latLonToVector3(light.latitude, light.longitude, 1.79)), [lights]);

  useEffect(() => {
    mesh.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    positions.forEach((position, index) => {
      const selected = lights[index]?.id === selectedId;
      const pulse = 1 + Math.sin(time * 2.1 + index * 0.73) * 0.18;
      const scale = (selected ? 0.052 : 0.034) * pulse;
      dummy.position.set(position.x, position.y, position.z);
      dummy.scale.setScalar(scale);
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
    <instancedMesh ref={mesh} args={[undefined, undefined, lights.length]} onClick={handleClick}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color="#f3c47a" toneMapped={false} />
    </instancedMesh>
  );
}
