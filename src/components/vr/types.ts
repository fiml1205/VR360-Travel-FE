export interface SceneData {
    image: string;
    hotspots: {
      position: [number, number, number];
      targetSceneId: string;
      label?: string;
    }[];
  }
  
  export interface VRSceneProps {
    sceneId: string;
    sceneData: SceneData;
    onChangeScene: (sceneId: string) => void;
    getImageById: (sceneId: string) => string;
  }