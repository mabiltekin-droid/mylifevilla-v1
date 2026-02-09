import Link from "next/link";
import { useEffect, useState } from "react";
import { isFav, toggleFav } from "../lib/favorites";
import { isCompared, toggleCompare } from "../lib/compare";
import { isNew } from "../lib/date";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export default function PropertyCard({ item }) {
  const img = (item.images || []).find(Boolean);
  const [fav, setFav] = useState(false);
  const [cmp, setCmp] = useState(false);

  useEffect(() => {
    setFav(isFav(item.id));
    setCmp(isCompared(item.id));
  }, [item.id]);

  const onFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFav(item.id);
    setFav(next.includes(String(item.id)));
  };

  const onCmp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleCompare(item.id);
    setCmp(next.includes(String(item.id)));
  };

  const newly = isNew(item.createdAt, 7);

  return (
    <Link href={`/listing/${item.id}`} className="block">
      <div className="card card-hover overflow-hidden">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className={`badge ${item.type === "Satilik" ? "badge-brand" : ""}`}>
              {item.type === "Satilik" ? "Satılık" : "Kiralık"}
            </span>
            {item.featured ? <span className="badge badge-gold">Öne Çıkan</span> : null}
            {newly ? <span className="badge" style={{ borderColor:"rgba(231,200,115,.45)", background:"rgba(231,200,115,.18)" }}>🆕 Yeni</span> : null}
          </div>

          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <button onClick={onCmp} aria-label="Karşılaştır" className="btn" style={{ padding:"8px 10px" }}>
              {cmp ? "☑" : "☐"}
            </button>
            <button onClick={onFav} aria-label="Favori" className="btn" style={{ padding:"8px 10px" }}>
              {fav ? "❤️" : "🤍"}
            </button>
          </div>

          {img ? (
            <div className="zoom-wrap">
              <img
                src={img}
                alt={item.title}
                className="h-48 w-full object-cover zoom-img"
                loading="lazy"
                width="1100"
                height="600"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl">🏡</div>
                <div className="mt-1 text-sm muted">Fotoğraf eklenecek</div>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
               style={{background:"linear-gradient(180deg, transparent, rgba(0,0,0,.10))"}} />
        </div>

        <div className="p-5 page-text">
          <div className="font-extrabold tracking-tight text-slate-900 line-clamp-2">
            {item.title}
          </div>
          <div className="mt-1 text-sm muted">
            {item.city} / {item.district}{item.neighborhood ? ` • ${item.neighborhood}` : ""}
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="text-xl font-extrabold text-slate-900">
              {formatTRY(item.price)} ₺
            </div>
            <div className="text-xs muted whitespace-nowrap">
              {item.area ? <span className="font-bold text-slate-700">{item.area}</span> : null} m²
              {item.rooms ? <span> • <span className="font-bold text-slate-700">{item.rooms}</span></span> : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
