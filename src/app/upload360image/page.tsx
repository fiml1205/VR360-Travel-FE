'use client';

import { useState } from 'react';
import CubeMapExtractor from '@/components/CubeMapExtractor';

export default function Upload360FormWithConversion() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.elements.namedItem('image') as HTMLInputElement;
    if (!fileInput?.files?.length) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    const generatedSceneId = `scene-${Date.now()}`;
    setSceneId(generatedSceneId);

    reader.onload = () => {
      const imageUrl = reader.result as string;
      setImageUrl(imageUrl);
    };

    reader.readAsDataURL(file);
    setUploading(true);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded max-w-xl mx-auto">
      <form onSubmit={handleUpload} className="mb-4">
        <input type="file" name="image" accept="image/*" required className="mb-2" />
        <br />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? 'Đang xử lý...' : 'Tải ảnh và chuyển đổi'}
        </button>
      </form>

      {imageUrl && sceneId && (
        <CubeMapExtractor
          panoramaUrl={imageUrl}
          sceneId={sceneId}
          onDone={() => {
            alert(`✅ Xử lý hoàn tất! Ảnh đã lưu trong: /images/image360/${sceneId}`);
            setUploading(false);
          }}
        />
      )}
    </div>
  );
}
