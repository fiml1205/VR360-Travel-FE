import { useEffect, useState } from "react";
import * as THREE from "three";

export const useSafeTexture = (url: string) => {
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