const fs = require("fs");
const path = require("path");

function w(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
}

/** ---------- Premium global styles ---------- **/
w("styles/globals.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Premium base */
:root { color-scheme: light; }
html, body { height: 100%; }
body {
  background: radial-gradient(1200px 600px at 20% -10%, rgba(99,102,241,0.10), transparent 60%),
              radial-gradient(900px 500px at 90% 0%, rgba(16,185,129,0.10), transparent 55%),
              #f8fafc;
  color: #0f172a;
}

/* Layout helpers */
.container-max { max-width: 76rem; margin: 0 auto; padding: 0 1rem; }

.card {
  background: rgba(255,255,255,0.85);
  border: 1px solid rgba(226,232,240,0.9);
  border-radius: 1.25rem;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(10px);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 800;
  border: 1px solid rgba(226,232,240,0.95);
  background: rgba(255,255,255,0.9);
}
.btn:hover { background: rgba(241,245,249,0.9); }

.btn-primary {
  border: 1px solid rgba(99,102,241,0.35);
  background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.12));
}
.btn-primary:hover {
  background: linear-gradient(135deg, rgba(99,102,241,0.24), rgba(16,185,129,0.16));
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 800;
}

.input {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgba(226,232,240,0.95);
  padding: 0.6rem 0.85rem;
  outline: none;
  background: rgba(255,255,255,0.9);
}
.input:focus { box-shadow: 0 0 0 4px rgba(148,163,184,0.20); }

.muted { color: #64748b; }
.hairline { border-color: rgba(226,232,240,0.9); }

`);

/** ---------- Navbar ---------- **/
w("components/Navbar.jsx", `export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-white/60 backdrop-blur">
      <div className="container-max h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border hairline bg-white">
            🏠
          </span>
          <span>MyLifeVilla</span>
        </a>

        <div className="flex items-center gap-2">
          <a className="btn" href="/">İlanlar</a>
          <a className="btn btn-primary" href="/admin/">Admin</a>
        </div>
      </div>
    </header>
  );
}
`);

/** ---------- Layout ---------- **/
w("components/Layout.jsx", `import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-max py-6">{children}</main>

      <footer className="mt-10 border-t hairline bg-white/60 backdrop-blur">
        <div className="container-max py-7 text-sm muted flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} MyLifeVilla — Pendik ve Tuzla Emlak</div>
          <div className="flex gap-3">
            <a className="hover:underline" href="/admin/">Yönetim</a>
            <a className="hover:underline" href="/">İlanlar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
`);

/** ---------- PropertyCard (premium) ---------- **/
w("components/PropertyCard.jsx", `function formatTRY(n) {
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
    <a href={\`/listing/\${item.id}\`} className="card overflow-hidden hover:shadow-lg transition block">
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {img ? (
          <img src={img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            Fotoğraf yok
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={\`badge \${badge}\`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
          {item.featured ? (
            <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-extrabold leading-snug line-clamp-2">
          {item.title}
        </h3>

        <div className="mt-1 text-sm muted">
          {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="text-lg font-extrabold">
            {formatTRY(item.price)} ₺
            {item.type === "Kiralik" ? <span className="text-sm font-semibold muted"> /ay</span> : null}
          </div>

          <div className="text-sm muted">
            <span className="font-semibold text-slate-700">{item.area}</span> m² •{" "}
            <span className="font-semibold text-slate-700">{item.rooms}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
`);

/** ---------- FilterBar (premium inputs) ---------- **/
w("components/FilterBar.jsx", `export default function FilterBar({
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
`);

/** ---------- Home page premium hero (uses FilterBar/PropertyCard) ---------- **/
w("pages/index.jsx", `import { useMemo, useState } from "react";
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

  const liveCount = useMemo(() => (data.items || []).filter(x => x.status === "Yayinda").length, []);
  const featuredCount = useMemo(() => (data.items || []).filter(x => x.status === "Yayinda" && x.featured).length, []);

  return (
    <Layout>
      <section className="card p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 badge bg-slate-100 text-slate-800">
              ✨ Premium • Pendik • Tuzla
            </div>
            <h1 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight">
              Hayalindeki evi hızlıca bul
            </h1>
            <p className="mt-2 muted">
              Filtrele, incele, favori ilanlarını vitrine al. Yönetim: <span className="font-semibold text-slate-700">/admin</span>
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="card px-4 py-3">
                <div className="text-xs font-extrabold muted">Yayındaki ilan</div>
                <div className="text-xl font-extrabold">{liveCount}</div>
              </div>
              <div className="card px-4 py-3">
                <div className="text-xs font-extrabold muted">Öne çıkan</div>
                <div className="text-xl font-extrabold">{featuredCount}</div>
              </div>
              <a className="btn btn-primary" href="/admin/">İlan ekle</a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="card p-5 w-[360px]">
              <div className="text-sm font-extrabold">İpucu</div>
              <div className="mt-2 muted text-sm">
                Admin panelden ilan ekledikten sonra “Publish” deyince otomatik GitHub commit + Netlify deploy olur.
              </div>
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
          <div className="text-sm muted">
            <span className="font-extrabold text-slate-700">{listings.length}</span> ilan bulundu
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="card p-10 muted">Sonuç yok. Filtreleri sıfırla.</div>
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

/** ---------- Listing detail with Gallery + Lightbox ---------- **/
w("pages/listing/[id].jsx", `import { useMemo, useState } from "react";
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

function Lightbox({ open, src, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button className="btn bg-white" onClick={onClose}>Kapat ✕</button>
        </div>
        <div className="card overflow-hidden">
          <img src={src} alt="Foto" className="w-full h-[70vh] object-contain bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function Detail({ item }) {
  const images = useMemo(() => (item?.images || []).filter(Boolean), [item]);
  const [active, setActive] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  if (!item) return null;

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  const cover = images[active] || images[0] || null;

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <a className="btn" href="/">← Geri</a>
        <a className="btn btn-primary" href="/admin/">Admin</a>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="relative aspect-[21/11] bg-slate-100">
              {cover ? (
                <button
                  className="w-full h-full"
                  style={{ display: "block" }}
                  onClick={() => setLbOpen(true)}
                  title="Büyüt"
                >
                  <img src={cover} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  Fotoğraf yok
                </div>
              )}

              <div className="absolute top-3 left-3 flex gap-2">
                <span className={\`badge \${badge}\`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
                {item.featured ? <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span> : null}
              </div>
            </div>

            {images.length > 1 ? (
              <div className="p-3 border-t hairline bg-white/70">
                <div className="flex gap-2 overflow-auto">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActive(i)}
                      className={\`h-16 w-24 rounded-xl overflow-hidden border \${i === active ? "border-slate-400" : "border-slate-200"}\`}
                      title={\`Foto \${i + 1}\`}
                    >
                      <img src={src} alt={\`thumb-\${i}\`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="card p-6 mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-slate-100 text-slate-800">{item.district}</span>
              {item.neighborhood ? <span className="badge bg-slate-100 text-slate-800">{item.neighborhood}</span> : null}
              {item.heating ? <span className="badge bg-slate-100 text-slate-800">{item.heating}</span> : null}
            </div>

            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              {item.title}
            </h1>

            <div className="mt-2 muted">
              {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div className="text-2xl font-extrabold">
                {formatTRY(item.price)} ₺
                {item.type === "Kiralik" ? <span className="text-base font-semibold muted"> /ay</span> : null}
              </div>

              <div className="text-sm muted">
                <span className="font-semibold text-slate-700">{item.area}</span> m² •{" "}
                <span className="font-semibold text-slate-700">{item.rooms}</span>
                {item.floor ? <> • Kat: <span className="font-semibold text-slate-700">{item.floor}</span></> : null}
                {Number.isFinite(item.age) ? <> • Yaş: <span className="font-semibold text-slate-700">{item.age}</span></> : null}
              </div>
            </div>
          </div>

          <div className="card p-6 mt-4">
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
              {item.floor ? <li><span className="font-semibold">Kat:</span> {item.floor}</li> : null}
              {Number.isFinite(item.age) ? <li><span className="font-semibold">Bina yaşı:</span> {item.age}</li> : null}
            </ul>
          </div>

          <div className="card p-6 mt-4 text-sm muted">
            Fotoğraf eklemek için Admin → İlanlar → Görseller alanını kullan.
          </div>
        </aside>
      </section>

      <Lightbox open={lbOpen} src={cover || ""} onClose={() => setLbOpen(false)} />
    </Layout>
  );
}
`);

console.log("✅ Premium + Galeri yazildi");
