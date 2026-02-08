
export default function FilterBar({
  q, setQ,
  district, setDistrict,
  type, setType,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sort, setSort,
  onReset
}) {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-4">
          <label className="text-xs font-bold text-slate-600">Ara</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Başlık, mahalle, oda (3+1)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-600">İlçe</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="ALL">Pendik + Tuzla</option>
            <option value="Pendik">Pendik</option>
            <option value="Tuzla">Tuzla</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-600">Tür</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="ALL">Hepsi</option>
            <option value="Satilik">Satılık</option>
            <option value="Kiralik">Kiralık</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-600">Min ₺</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-600">Max ₺</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            type="number"
            min="0"
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="md:col-span-10">
          <label className="text-xs font-bold text-slate-600">Sıralama</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Öne çıkan</option>
            <option value="price_asc">Fiyat ↑</option>
            <option value="price_desc">Fiyat ↓</option>
            <option value="area_desc">m² ↓</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-end">
          <button className="btn w-full" onClick={onReset}>Sıfırla</button>
        </div>
      </div>
    </div>
  );
}
