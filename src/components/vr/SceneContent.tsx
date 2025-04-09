import { useRef, useState } from "react";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import ArrowHotspot from "./ArrowHotspot";
import type { SceneData } from "./types";

interface SceneContentProps {
    sceneData: SceneData;
    onChangeScene: (sceneId: string) => void;
    getImageById: (sceneId: string) => string;
}

export default function SceneContent({ sceneData, onChangeScene, getImageById }: SceneContentProps) {
    const texture = useLoader(THREE.TextureLoader, sceneData.image);
    const { camera } = useThree();
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    cameraRef.current = camera as THREE.PerspectiveCamera;

    const [isAnimating, setIsAnimating] = useState(false);

    const zoomToHotspot = (target: THREE.Vector3, nextSceneId: string, nextImageUrl: string) => {
        if (!cameraRef.current || !controlsRef.current) return;
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        const start = camera.position.clone();
        const end = target.clone().normalize().multiplyScalar(2.5);
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
                const loader = new THREE.TextureLoader();
                loader.load(nextImageUrl, () => {
                    camera.position.set(0, 0, 0.1);
                    controls.target.set(0, 0, 0);
                    controls.update();
                    onChangeScene(nextSceneId);
                    setIsHotspotVisible(true);
                });
            }
        };

        setIsAnimating(true);
        animate();
    };

    const [isHotspotVisible, setIsHotspotVisible] = useState(true);

    return (
        <>
            <ambientLight intensity={1} />
            <OrbitControls
                ref={controlsRef}
                enableZoom
                enablePan={false}
                minDistance={1}
                maxDistance={4.9}
            />
            <mesh>
                <sphereGeometry args={[5, 60, 40]} />
                <meshBasicMaterial map={texture} side={THREE.BackSide} />
            </mesh>
            {isHotspotVisible && sceneData.hotspots.map((hotspot, index) => (
                <ArrowHotspot
                    key={index}
                    position={hotspot.position}
                    label={hotspot.label}
                    onClick={() => {
                        if (isAnimating) return;
                        setIsHotspotVisible(false);
                        const pos = new THREE.Vector3(...hotspot.position);
                        const imageUrl = getImageById(hotspot.targetSceneId);
                        zoomToHotspot(pos, hotspot.targetSceneId, imageUrl);
                    }}
                />
            ))}
        </>
    );
}
