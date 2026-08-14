import { useState, useEffect, useCallback } from "react";
import "./PhotoGallery.css";

export default function PhotoGallery({ photos, alt }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, next, prev]);

  if (!photos || photos.length === 0) {
    return <div className="gallery__empty">—</div>;
  }

  return (
    <div className="gallery">
      <button className="gallery__main" onClick={() => setLightbox(true)} aria-label="Agrandir la photo">
        <img src={photos[index]} alt={`${alt} — ${index + 1}/${photos.length}`} />
      </button>

      {photos.length > 1 && (
        <div className="gallery__thumbs">
          {photos.map((p, i) => (
            <button
              key={p}
              className={`gallery__thumb ${i === index ? "gallery__thumb--active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <img src={p} alt="" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lightbox__close" onClick={() => setLightbox(false)} aria-label="Fermer">
            ✕
          </button>
          {photos.length > 1 && (
            <button className="lightbox__nav lightbox__nav--prev" onClick={prev} aria-label="Photo précédente">
              ‹
            </button>
          )}
          <img className="lightbox__img" src={photos[index]} alt={`${alt} — ${index + 1}/${photos.length}`} />
          {photos.length > 1 && (
            <button className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Photo suivante">
              ›
            </button>
          )}
          <div className="lightbox__count">
            {index + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
