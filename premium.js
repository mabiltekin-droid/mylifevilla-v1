const fs = require("fs");
const path = require("path");

function w(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
}

w("components/FilterBar.jsx", `
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
`);

w("components/PropertyCard.jsx", `
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
    <a href={\`/listing/\${item.id}\`} className="card overflow-hidden hover:shadow-md transition block">
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
          <span className={\`badge \${badge}\`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
          {item.featured ? (
            <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span>
          ) : null}
        </div>

        <h3 className="mt-3 font-extrabold leading-snug">
          {item.title}
        </h3>

        <div className="mt-1 text-sm text-slate-600">
          {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
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
`);

w("pages/index.jsx", `
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import FilterBar from "../components/FilterBar";
import PropertyCard from "../components/PropertyCard";
import data from "../data/listings.json";

function normalize(s) {
  return (s || "").toString().toLowerCase().trim();
}

export default function Home() {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");

  const listings = useMemo(() => {
    const items = (data.items || []).filter(x => x.status === "Yayinda");

    const qn = normalize(q);
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;

    let filtered = items.filter(x => {
      if (district !== "ALL" && x.district !== district) return false;
      if (type !== "ALL" && x.type !== type) return false;

      const price = Number(x.price);
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      if (qn) {
        const hay = normalize(\`\${x.title} \${x.neighborhood || ""} \${x.rooms || ""} \${x.district}\`);
        if (!hay.includes(qn)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sort === "price_asc") return Number(a.price) - Number(b.price);
      if (sort === "price_desc") return Number(b.price) - Number(a.price);
      if (sort === "area_desc") return Number(b.area) - Number(a.area);

      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fb !== fa) return fb - fa;
      return (b.id || "").localeCompare(a.id || "");
    });

    return filtered;
  }, [q, district, type, minPrice, maxPrice, sort]);

  const onReset = () => {
    setQ("");
    setDistrict("ALL");
    setType("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  };

  const featuredCount = useMemo(() => (data.items || []).filter(x => x.status === "Yayinda" && x.featured).length, []);

  return (
    <Layout>
      <section className="card p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 badge bg-slate-100 text-slate-800">
              Pendik • Tuzla
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Premium Emlak İlanları
            </h1>
            <p className="mt-2 text-slate-600">
              Admin’den ekle → <span className="font-semibold">/admin</span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="card px-4 py-3">
              <div className="text-xs font-bold text-slate-500">Yayındaki ilan</div>
              <div className="text-xl font-extrabold">{(data.items || []).filter(x => x.status === "Yayinda").length}</div>
            </div>
            <div className="card px-4 py-3">
              <div className="text-xs font-bold text-slate-500">Öne çıkan</div>
              <div className="text-xl font-extrabold">{featuredCount}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4">
        <FilterBar
          q={q} setQ={setQ}
          district={district} setDistrict={setDistrict}
          type={type} setType={setType}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          sort={sort} setSort={setSort}
          onReset={onReset}
        />
      </div>

      <section className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-600">
            <span className="font-semibold">{listings.length}</span> ilan bulundu
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="card p-10 text-slate-600">Sonuç yok. Filtreleri sıfırla.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(item => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
`);

w("pages/listing/[id].jsx", `
import Layout from "../../components/Layout";
import data from "../../data/listings.json";

function formatTRY(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export async function getStaticPaths() {
  const paths = (data.items || [])
    .filter(x => x.status === "Yayinda")
    .map(x => ({ params: { id: x.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const item = (data.items || []).find(x => x.id === params.id) || null;
  return { props: { item } };
}

export default function Detail({ item }) {
  if (!item) return null;

  const img = item?.images?.[0];

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <a className="btn" href="/">← Geri</a>
        <a className="btn" href="/admin/">Admin</a>
      </div>

      <section className="card overflow-hidden">
        <div className="aspect-[21/9] bg-slate-100">
          {img ? (
            <img src={img} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Kapak fotoğrafı yok
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={\`badge \${badge}\`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
            {item.featured ? <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span> : null}
            <span className="badge bg-slate-100 text-slate-800">{item.district}</span>
          </div>

          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
            {item.title}
          </h1>

          <div className="mt-2 text-slate-600">
            {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="text-2xl font-extrabold">
              {formatTRY(item.price)} ₺
              {item.type === "Kiralik" ? <span className="text-base font-semibold text-slate-500"> /ay</span> : null}
            </div>

            <div className="text-sm text-slate-600">
              <span className="font-semibold">{item.area}</span> m² •{" "}
              <span className="font-semibold">{item.rooms}</span>
              {item.floor ? <> • Kat: <span className="font-semibold">{item.floor}</span></> : null}
              {Number.isFinite(item.age) ? <> • Yaş: <span className="font-semibold">{item.age}</span></> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-extrabold">Açıklama</h2>
            <p className="mt-2 whitespace-pre-line text-slate-700">
              {item.description}
            </p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-extrabold">Özet</h3>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li><span className="font-semibold">İlçe:</span> {item.district}</li>
              {item.neighborhood ? <li><span className="font-semibold">Mahalle:</span> {item.neighborhood}</li> : null}
              <li><span className="font-semibold">m²:</span> {item.area}</li>
              <li><span className="font-semibold">Oda:</span> {item.rooms}</li>
              {item.heating ? <li><span className="font-semibold">Isınma:</span> {item.heating}</li> : null}
            </ul>
          </div>

          <div className="card p-6 mt-4 text-sm text-slate-600">
            Admin panelden ilan ekleyince otomatik burada görünür.
          </div>
        </aside>
      </section>
    </Layout>
  );
}
`);

console.log("Premium UI yazildi ✅");
