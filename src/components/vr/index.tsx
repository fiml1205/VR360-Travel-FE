"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SceneContent from "./SceneContent";
import type { VRSceneProps } from "./types";

export default function VRScene({ sceneId, sceneData, onChangeScene, getImageById }: VRSceneProps) {
  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0.1] }}>
        <Suspense fallback={null}>
          <SceneContent
            key={sceneId}
            sceneData={sceneData}
            onChangeScene={onChangeScene}
            getImageById={getImageById}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}