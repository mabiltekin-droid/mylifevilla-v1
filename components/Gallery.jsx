
import { useEffect, useMemo, useRef, useState } from "react";

export default function Gallery({ images = [], title = "Foto" }) {
  const list = useMemo(() => (images || []).filter(Boolean), [images]);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef(null);
  const deltaX = useRef(0);

  const has = list.length > 0;
  const active = has ? (list[i] || list[0]) : null;

  const prev = () => setI((x) => (x - 1 + list.length) % list.length);
  const next = () => setI((x) => (x + 1) % list.length);

  useEffect(() => {
    const onKey = (e) => {
      if (!open || list.length < 2) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list.length]);

  const onPointerDown = (e) => {
    if (list.length < 2) return;
    startX.current = e.clientX;
    deltaX.current = 0;
  };

  const onPointerMove = (e) => {
    if (startX.current == null) return;
    deltaX.current = e.clientX - startX.current;
  };

  const onPointerUp = () => {
    if (startX.current == null) return;
    const dx = deltaX.current;
    startX.current = null;
    deltaX.current = 0;
    // swipe threshold
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev();
      else next();
    }
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div
          className="relative aspect-[21/11] bg-slate-100 select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {active ? (
            <button className="w-full h-full block" onClick={() => setOpen(true)} title="Büyüt">
              <img
                src={active}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-200"
                loading="lazy"
              />
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Fotoğraf yok
            </div>
          )}

          {list.length > 1 ? (
            <>
              <div className="absolute top-3 right-3 badge bg-black/60 text-white">
                {i + 1}/{list.length}
              </div>

              <div className="absolute inset-y-0 left-3 flex items-center">
                <button className="btn bg-white/90" onClick={prev} aria-label="Önceki">←</button>
              </div>

              <div className="absolute inset-y-0 right-3 flex items-center">
                <button className="btn bg-white/90" onClick={next} aria-label="Sonraki">→</button>
              </div>
            </>
          ) : null}
        </div>

        {list.length > 1 ? (
          <div className="p-3 border-t hairline bg-white/70">
            <div className="flex gap-2 overflow-auto">
              {list.map((src, idx) => (
                <button
                  key={src + idx}
                  onClick={() => setI(idx)}
                  className={`h-16 w-24 rounded-xl overflow-hidden border ${idx === i ? "border-slate-400" : "border-slate-200"}`}
                  title={`Foto ${idx + 1}`}
                >
                  <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="badge bg-white/90 text-slate-800">{title}</div>
              <button className="btn bg-white" onClick={() => setOpen(false)}>Kapat ✕</button>
            </div>

            <div className="card overflow-hidden">
              <div className="relative bg-slate-100">
                <img src={active} alt={title} className="w-full h-[70vh] object-contain" />
                {list.length > 1 ? (
                  <>
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <button className="btn bg-white" onClick={prev} aria-label="Önceki">←</button>
                    </div>
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <button className="btn bg-white" onClick={next} aria-label="Sonraki">→</button>
                    </div>
                    <div className="absolute top-3 right-3 badge bg-black/60 text-white">
                      {i + 1}/{list.length}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-2 text-sm text-white/80">
              İpucu: Klavye ← → ile gez, ESC ile kapat. Mobilde swipe çalışır.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
