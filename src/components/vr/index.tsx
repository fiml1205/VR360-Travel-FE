"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SceneContent from "./SceneContent";
import type { VRSceneProps } from "../types";

export default function VRScene({ projectId, sceneId, sceneData, onChangeScene, getImageById }: VRSceneProps) {
  return (
    <Canvas camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 0.1] }} style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={null}>
        <SceneContent
          projectId={projectId}
          sceneId={sceneId}
          sceneData={sceneData}
          onChangeScene={onChangeScene}
          getImageById={getImageById}
        />
      </Suspense>
    </Canvas>
  );
}