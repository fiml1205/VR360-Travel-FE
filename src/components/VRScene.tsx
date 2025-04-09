import { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export interface SceneData {
  image: string;
  hotspots: {
    position: [number, number, number];
    targetSceneId: string;
  }[];
}

interface VRSceneProps {
  sceneData: SceneData;
  onChangeScene: (sceneId: string) => void;
}

// Load texture
const useSafeTexture = (url: string) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => setTexture(tex));
    return () => {
      if (texture) texture.dispose();
    };
  }, [url]);

  return texture;
};

const Sphere360 = ({ texture }: { texture: THREE.Texture | null }) => {
  if (!texture) return null;
  return (
    <mesh>
      <sphereGeometry args={[5, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const Hotspot = ({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick: () => void;
}) => (
  <mesh position={position} onClick={onClick}>
    <sphereGeometry args={[0.2, 16, 16]} />
    <meshBasicMaterial color="yellow" />
  </mesh>
);

export default function VRScene({ sceneData, onChangeScene }: VRSceneProps) {
  const texture = useSafeTexture(sceneData.image);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hàm zoom tới hotspot rồi chuyển ảnh
  const zoomToHotspot = (target: THREE.Vector3, onComplete: () => void) => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const start = camera.position.clone();
    const end = target.clone().normalize().multiplyScalar(2.5); // zoom gần
    controls.target.copy(target);
    controls.update();

    let progress = 0;
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animate = () => {
      progress += 0.02;
      const eased = easeInOut(Math.min(progress, 1));
      const newPos = start.clone().lerp(end, eased);
      camera.position.copy(newPos);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete();
      }
    };

    setIsAnimating(true);
    animate();
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas
        className="w-full h-full"
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0.1] }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
        }}
      >
        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan={false}
          minDistance={1}
          maxDistance={4.9}
        />
        <Sphere360 texture={texture} />

        {sceneData.hotspots.map((hotspot, index) => (
          <Hotspot
            key={index}
            position={hotspot.position}
            onClick={() => {
              if (isAnimating) return;
              const pos = new THREE.Vector3(...hotspot.position);
              zoomToHotspot(pos, () => {
                cameraRef.current?.position.set(0, 0, 0.1); // ✅ reset về gần tâm
                controlsRef.current?.target.set(0, 0, 0);   // ✅ nhìn thẳng
                controlsRef.current?.update();
                onChangeScene(hotspot.targetSceneId);
              });
            }}
          />
        ))}
      </Canvas>
    </div>
  );
}