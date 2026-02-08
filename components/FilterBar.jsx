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
          <label className="text-xs font-extrabold muted">Ara</label>
          <input
            className="input mt-1"
            placeholder="Başlık, mahalle, oda (3+1)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-extrabold muted">İlçe</label>
          <select
            className="input mt-1"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="ALL">Pendik + Tuzla</option>
            <option value="Pendik">Pendik</option>
            <option value="Tuzla">Tuzla</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-extrabold muted">Tür</label>
          <select
            className="input mt-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="ALL">Hepsi</option>
            <option value="Satilik">Satılık</option>
            <option value="Kiralik">Kiralık</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-extrabold muted">Min ₺</label>
          <input
            className="input mt-1"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-extrabold muted">Max ₺</label>
          <input
            className="input mt-1"
            type="number"
            min="0"
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="md:col-span-10">
          <label className="text-xs font-extrabold muted">Sıralama</label>
          <select
            className="input mt-1"
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
