import { useMemo } from "react";
import data from "../data/listings.json";

function uniq(arr){
  return Array.from(new Set(arr.filter(Boolean)));
}

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function FilterBar({
  q, setQ,
  district, setDistrict,
  type, setType,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sort, setSort,
  onReset,
}) {
  const liveItems = useMemo(() => (data.items || []).filter(x => x.status === "Yayinda"), []);

  const districts = useMemo(() => {
    const ds = uniq(liveItems.map(x => x.district));
    // Pendik/Tuzla odaklı; başka varsa da eklenir
    return ds.sort((a,b) => String(a).localeCompare(String(b), "tr"));
  }, [liveItems]);

  const types = useMemo(() => {
    const ts = uniq(liveItems.map(x => x.type));
    return ts;
  }, [liveItems]);

  const rooms = useMemo(() => {
    const rs = uniq(liveItems.map(x => x.rooms));
    return rs.sort((a,b) => String(a).localeCompare(String(b), "tr"));
  }, [liveItems]);

  const priceStats = useMemo(() => {
    const prices = liveItems.map(x => toNum(x.price)).filter(v => v !== null);
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : 0;
    return { min, max };
  }, [liveItems]);

  const minP = minPrice !== "" ? Number(minPrice) : "";
  const maxP = maxPrice !== "" ? Number(maxPrice) : "";

  const clampPair = (minV, maxV) => {
    let a = toNum(minV);
    let b = toNum(maxV);
    if (a === null) a = priceStats.min;
    if (b === null) b = priceStats.max;
    if (a > b) [a, b] = [b, a];
    return { a, b };
  };

  const onMinSlider = (v) => {
    const { a, b } = clampPair(v, maxP === "" ? priceStats.max : maxP);
    setMinPrice(String(a));
    if (maxP !== "" && a > Number(maxP)) setMaxPrice(String(b));
  };

  const onMaxSlider = (v) => {
    const { a, b } = clampPair(minP === "" ? priceStats.min : minP, v);
    setMaxPrice(String(b));
    if (minP !== "" && b < Number(minP)) setMinPrice(String(a));
  };

  return (
    <div className="card p-5 page-text">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="text-xs font-extrabold muted mb-1">Ara</div>
            <input
              className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
              placeholder="Başlık / mahalle / oda..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* District */}
          <div>
            <div className="text-xs font-extrabold muted mb-1">İlçe</div>
            <select
              className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="ALL">Tümü</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <div className="text-xs font-extrabold muted mb-1">Tip</div>
            <select
              className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ALL">Tümü</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "Satilik" ? "Satılık" : t === "Kiralik" ? "Kiralık" : t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <div className="text-xs font-extrabold muted mb-1">Sırala</div>
            <select
              className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Öne çıkan + Yeni</option>
              <option value="price_asc">Fiyat (Artan)</option>
              <option value="price_desc">Fiyat (Azalan)</option>
              <option value="area_desc">m² (Büyükten)</option>
            </select>
          </div>

          {/* Rooms (bonus) */}
          <div>
            <div className="text-xs font-extrabold muted mb-1">Oda</div>
            <select
              className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
              value={(typeof window !== "undefined" && (window.__roomsVal || "ALL")) || "ALL"}
              onChange={(e) => { window.__roomsVal = e.target.value; }}
            >
              <option value="ALL">Tümü</option>
              {rooms.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="text-[11px] muted mt-1">* Oda filtresi arama kutusuna da yazılabilir.</div>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <div className="text-xs font-extrabold muted mb-2">Fiyat aralığı</div>
            <div className="flex gap-3 items-center">
              <input
                type="range"
                min={priceStats.min}
                max={priceStats.max}
                value={minP === "" ? priceStats.min : minP}
                onChange={(e) => onMinSlider(e.target.value)}
                className="w-full"
              />
              <input
                type="range"
                min={priceStats.min}
                max={priceStats.max}
                value={maxP === "" ? priceStats.max : maxP}
                onChange={(e) => onMaxSlider(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs muted">
              <span>Min: <b className="text-slate-800">{minPrice || priceStats.min}</b></span>
              <span>Max: <b className="text-slate-800">{maxPrice || priceStats.max}</b></span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-full">
              <div className="text-xs font-extrabold muted mb-1">Min ₺</div>
              <input
                className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g,""))}
                placeholder={String(priceStats.min)}
              />
            </div>
            <div className="w-full">
              <div className="text-xs font-extrabold muted mb-1">Max ₺</div>
              <input
                className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g,""))}
                placeholder={String(priceStats.max)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button className="btn" onClick={onReset}>Filtreleri sıfırla</button>
        </div>
      </div>
    </div>
  );
}
