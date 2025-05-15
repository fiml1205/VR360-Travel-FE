export interface Hotspot {
  position: [number, number, number];
  targetSceneId: number;
  label?: string;
}

export interface SceneData {
  id: number;
  image: string;
  hotspots: Hotspot[];
}

export interface ProjectData {
  id: number;
  name: string;
  alias: string;
  detail?: string;
  images360: SceneData[];
}

export interface VRSceneProps {
  projectId: number;
  sceneId: number;
  sceneData: SceneData;
  onChangeScene: (sceneId: number) => void;
  getImageById: (sceneId: number) => string;
}
