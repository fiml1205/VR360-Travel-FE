import type { SceneData } from "@/components/vr/types";

export const sceneMap: Record<string, SceneData> = {
  home: {
    image: "/images/test1.jpg",
    hotspots: [{ position: [4, 0, 0], targetSceneId: "beach", label: "Ra biển" }],
  },
  beach: {
    image: "/images/test2.jpg",
    hotspots: [{ position: [-4, 0, 0], targetSceneId: "home", label: "Về nhà" }],
  },
};