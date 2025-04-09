import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ArrowHotspotProps {
  position: [number, number, number];
  label?: string;
  onClick: () => void;
}

export default function ArrowHotspot({ position, label, onClick }: ArrowHotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + 0.1 * Math.sin(clock.getElapsedTime() * 3);
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.lookAt(camera.position);
    }

    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {label && (
        <Text
          ref={textRef}
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.01}
          outlineColor="black"
        >
          {label}
        </Text>
      )}
    </group>
  );
}