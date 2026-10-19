import { useState } from 'react';
import { resolveImageUrl } from '../api/api';

export default function Gallery({ images, alt }) {
  const validImages = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="aspect-video rounded-2xl bg-ocean-100 flex items-center justify-center text-ocean-400">
        No images available
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl overflow-hidden aspect-video shadow-card">
        <img
          src={resolveImageUrl(validImages[active])}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-3 mt-3">
          {validImages.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                i === active ? 'border-ocean-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={resolveImageUrl(img)} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
