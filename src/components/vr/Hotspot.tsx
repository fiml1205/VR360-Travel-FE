import { useRef, useState } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HotspotProps {
  position: [number, number, number];
  previewUrl: string;
  onClick: () => void;
}

export default function Hotspot({
  position,
  previewUrl,
  onClick,
}: HotspotProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const texture = useLoader(THREE.TextureLoader, previewUrl);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

useFrame(() => {
  if (!spriteRef.current) return;

  // Scale effect khi hover
  const targetScale = hovered ? 0.4 : 0.2;
  const currentScale = spriteRef.current.scale.x;
  const lerped = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
  spriteRef.current.scale.set(lerped, lerped, 1);

  // Tính toạ độ sprite trong không gian camera
  const spriteWorldPos = new THREE.Vector3(...position);
  const cameraMatrix = new THREE.Matrix4().copy(camera.matrixWorldInverse);
  const viewPos = spriteWorldPos.clone().applyMatrix4(cameraMatrix);

  // Nếu z > 0 => điểm nằm phía sau camera trong view space
  spriteRef.current.visible = viewPos.z < -0.2; // càng âm thì càng phía trước camera
});

  return (
    <sprite
      ref={spriteRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}
