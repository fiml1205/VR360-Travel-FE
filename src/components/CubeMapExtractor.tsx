// File: components/CubeMapExtractor.tsx (with correct cube camera directions)

import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

interface CubeMapExtractorProps {
  panoramaUrl: string;
  sceneId: string;
  onDone?: () => void;
}

export default function CubeMapExtractor({ panoramaUrl, sceneId, onDone }: CubeMapExtractorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const width = 1024;
    const height = 1024;

    const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const directions: [string, THREE.Vector3, THREE.Vector3][] = [
      ['posx', new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0)],
      ['negx', new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0)],
      ['posy', new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)],
      ['negy', new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, -1)],
      ['posz', new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0)],
      ['negz', new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, -1, 0)],
    ];

    new THREE.TextureLoader().load(panoramaUrl, async (texture) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(500, 64, 64),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
      );
      scene.add(sphere);

      for (const [name, dir, up] of directions) {
        setStatus(`Đang xử lý ${name}...`);

        camera.up.copy(up);
        camera.lookAt(dir);
        renderer.render(scene, camera);

        const dataUrl = renderer.domElement.toDataURL('image/jpeg', 0.95);
        const blob = await (await fetch(dataUrl)).blob();

        const formData = new FormData();
        formData.append('file', blob, `${name}.jpg`);
        formData.append('sceneId', sceneId);

        await fetch('/api/upload-face', {
          method: 'POST',
          body: formData,
        });
      }

      setStatus('✅ Hoàn tất!');
      onDone?.();
    });

    return () => {
      renderer.dispose();
    };
  }, [panoramaUrl, sceneId, onDone]);

  return <div ref={containerRef}><p className="text-white text-sm mt-2">{status}</p></div>;
}
