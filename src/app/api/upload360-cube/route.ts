// // File: src/app/api/upload-face/route.ts

// import { NextRequest } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get('file') as File;
//   if (!file) return new Response('No file', { status: 400 });

//   const sceneId = formData.get('sceneId') as string || `scene-${Date.now()}`;
//   const faceName = file.name || `face-${Date.now()}.jpg`;

//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   const dir = path.join(process.cwd(), 'public/images/image360', sceneId);
//   fs.mkdirSync(dir, { recursive: true });

//   const outPath = path.join(dir, faceName);
//   fs.writeFileSync(outPath, buffer);

//   return new Response(JSON.stringify({ message: 'Uploaded', path: `/images/image360/${sceneId}/${faceName}` }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }


import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import * as THREE from 'three';
import { createCanvas } from 'canvas';
import gl from 'gl';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;
  if (!file) return new Response('No file uploaded', { status: 400 });

  const tmpDir = path.join(process.cwd(), 'tmp');
  fs.mkdirSync(tmpDir, { recursive: true });
  const tempPath = path.join(tmpDir, `upload-${Date.now()}.jpg`);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(tempPath, buffer);

  try {
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    (global as any).window = dom.window;
    (global as any).document = dom.window.document;

    const width = 1024, height = 1024;
    const context = gl(width, height, { preserveDrawingBuffer: true });
    const renderer = new THREE.WebGLRenderer({ context });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    const renderTarget = new THREE.WebGLRenderTarget(width, height);
    renderer.setRenderTarget(renderTarget);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      new THREE.TextureLoader().load(tempPath, resolve, undefined, reject);
    });

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(500, 64, 64),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
    );
    scene.add(sphere);

    const directions: [string, THREE.Vector3, THREE.Vector3][] = [
      ['posx', new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0)],
      ['negx', new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0)],
      ['posy', new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)],
      ['negy', new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, -1)],
      ['posz', new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0)],
      ['negz', new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, -1, 0)],
    ];

    const sceneId = `scene-${Date.now()}`;
    const outputDir = path.join(process.cwd(), 'public/images/image360', sceneId);
    fs.mkdirSync(outputDir, { recursive: true });

    const glContext = renderer.getContext();
    const pixels = new Uint8Array(width * height * 4);

    for (const [name, dir, up] of directions) {
      camera.up.copy(up);
      camera.lookAt(dir);
      renderer.render(scene, camera);
      glContext.readPixels(0, 0, width, height, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);

      // flip Y
      ctx.putImageData(imageData, 0, 0);
      ctx.scale(1, -1);
      ctx.drawImage(canvas, 0, -height);

      const outPath = path.join(outputDir, `${name}.jpg`);
      const outStream = fs.createWriteStream(outPath);
      const stream = canvas.createJPEGStream({ quality: 0.95 });
      stream.pipe(outStream);
      await new Promise(resolve => outStream.on('finish', resolve));
    }

    fs.unlinkSync(tempPath);

    return new Response(JSON.stringify({ message: 'Cube faces saved', scene: sceneId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response('Processing failed', { status: 500 });
  }
}

