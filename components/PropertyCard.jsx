
function formatTRY(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export default function PropertyCard({ item }) {
  const img = item?.images?.[0];

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  return (
    <a href={`/listing/${item.id}`} className="card overflow-hidden hover:shadow-md transition block">
      <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
        {img ? (
          <img src={img} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            Fotoğraf yok
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`badge ${badge}`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
          {item.featured ? (
            <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span>
          ) : null}
        </div>

        <h3 className="mt-3 font-extrabold leading-snug">
          {item.title}
        </h3>

        <div className="mt-1 text-sm text-slate-600">
          {item.city} / {item.district}{item.neighborhood ? ` • ${item.neighborhood}` : ""}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="text-lg font-extrabold">
            {formatTRY(item.price)} ₺
            {item.type === "Kiralik" ? <span className="text-sm font-semibold text-slate-500"> /ay</span> : null}
          </div>

          <div className="text-sm text-slate-600">
            <span className="font-semibold">{item.area}</span> m² • <span className="font-semibold">{item.rooms}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
