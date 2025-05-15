import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import ArrowHotspot from "./ArrowHotspot";
import type { SceneData, VRSceneProps } from "./types";

export default function SceneContent({ projectId, sceneId, sceneData, onChangeScene, getImageById }: VRSceneProps) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const textureCache = useRef<Record<string, THREE.Texture>>({});
    const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Load ảnh hiện tại
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(sceneData.image, (texture) => {
            setCurrentTexture(texture);
            textureCache.current[`${projectId}_${sceneData.id}`] = texture;
            if (camera && controlsRef.current) {
                camera.position.set(0, 0, 4.9);
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
            }
        });
    }, [projectId, sceneData.id, sceneData.image]);

    // Preload ảnh hotspot
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        sceneData.hotspots.forEach(hotspot => {
            const key = `${projectId}_${hotspot.targetSceneId}`;
            if (!textureCache.current[key]) {
                const url = getImageById(hotspot.targetSceneId);
                loader.load(url, (texture) => {
                    textureCache.current[key] = texture;
                });
            }
        });
    }, [projectId, sceneData.hotspots, getImageById]);

    const zoomToHotspot = (target: THREE.Vector3, nextSceneId: number) => {
        if (!camera || !controlsRef.current) return;

        const controls = controlsRef.current;
        const startPos = camera.position.clone();
        const startTarget = controls.target.clone();
        const endPos = target.clone().normalize().multiplyScalar(2.5);
        const endTarget = target.clone();
        const duration = 1500;
        const startTime = performance.now();

        const easeInOut = (t: number) =>
            t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = easeInOut(t);

            const newPos = startPos.clone().lerp(endPos, eased);
            const newTarget = startTarget.clone().lerp(endTarget, eased);

            camera.position.copy(newPos);
            controls.target.copy(newTarget);
            controls.update();

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                const key = `${projectId}_${nextSceneId}`;
                const texture = textureCache.current[key];
                if (texture && meshRef.current) {
                    const material = meshRef.current.material as THREE.MeshBasicMaterial;
                    material.map = texture;
                    material.needsUpdate = true;
                    setCurrentTexture(texture);
                }
                onChangeScene(nextSceneId);
                camera.position.set(0, 0, 4.9);
                controls.target.set(0, 0, 0);
                controls.update();
                setIsAnimating(false);
            }
        };

        setIsAnimating(true);
        requestAnimationFrame(animate);
    };

    return (
        <>
            <ambientLight intensity={1} />
            <OrbitControls
                ref={controlsRef}
                enableZoom
                enablePan={false}
                minDistance={1}
                maxDistance={5}
            />
            {currentTexture && (
                <mesh ref={meshRef}>
                    <sphereGeometry args={[5, 60, 40]} />
                    <meshBasicMaterial map={currentTexture} side={THREE.BackSide} />
                </mesh>
            )}
            {sceneData.hotspots.map((hotspot, idx) => (
                <ArrowHotspot
                    key={idx}
                    position={hotspot.position}
                    label={hotspot.label}
                    onClick={() => {
                        if (isAnimating) return;
                        const pos = new THREE.Vector3(...hotspot.position);
                        zoomToHotspot(pos, hotspot.targetSceneId);
                    }}
                />
            ))}
        </>
    );
}
