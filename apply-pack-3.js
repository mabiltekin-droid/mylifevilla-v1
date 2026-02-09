const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");

console.log("▶ apply-pack-3 running...");

/* ========= favorites utils ========= */
w("lib/favorites.js", `const KEY = "mylifevilla:favorites";

export function getFavorites(){
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export function setFavorites(ids){
  if (typeof window === "undefined") return;
  const uniq = Array.from(new Set((ids || []).map(String)));
  localStorage.setItem(KEY, JSON.stringify(uniq));
}

export function isFav(id){
  const ids = getFavorites();
  return ids.includes(String(id));
}

export function toggleFav(id){
  const sid = String(id);
  const ids = getFavorites();
  const next = ids.includes(sid) ? ids.filter(x => x !== sid) : [...ids, sid];
  setFavorites(next);
  return next;
}
`);

/* ========= background: logo yeşiline ========= */
{
  const cssPath = "styles/globals.css";
  if (exists(cssPath)) {
    let css = read(cssPath);

    // body background'ını daha yeşil / logo tonuna çek
    // (mevcut body bloğunu bulup replace etmeye çalışalım; bulamazsak sona ekleriz)
    const bodyRe = /body\s*\{[\s\S]*?\}/m;
    const newBody = `body{
  /* Logo yeşiline yakın premium arka plan */
  background:
    radial-gradient(1000px 420px at 50% -180px, rgba(231,200,115,.18), transparent 60%),
    radial-gradient(1200px 600px at 20% 0%, rgba(15,61,46,.28), transparent 62%),
    linear-gradient(180deg, #062018 0%, #0f3d2e 35%, #0b2d22 100%);
  color:#eaf2ef;
}`;

    if (bodyRe.test(css)) {
      css = css.replace(bodyRe, newBody);
    } else {
      css += "\n\n" + newBody + "\n";
    }

    // kartlar beyaz kaldığı için, yazılar okunur olsun: sayfa içi text varsayılanı
    if (!css.includes(".page-text")) {
      css += `
/* sayfa içi koyu yazı için */
.page-text{ color:#0f172a; }
`;
    }

    fs.writeFileSync(cssPath, css, "utf8");
  }
}

/* ========= FilterBar: auto options + price sliders ========= */
w("components/FilterBar.jsx", `import { useMemo } from "react";
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
`);

/* ========= PropertyCard: favori kalbi ekle (Link’i bozmadan) ========= */
w("components/PropertyCard.jsx", `import Link from "next/link";
import { useEffect, useState } from "react";
import { isFav, toggleFav } from "../lib/favorites";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export default function PropertyCard({ item }) {
  const img = (item.images || []).find(Boolean);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFav(item.id));
  }, [item.id]);

  const onFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFav(item.id);
    setFav(next.includes(String(item.id)));
  };

  return (
    <Link href={\`/listing/\${item.id}\`} className="block">
      <div className="card card-hover overflow-hidden">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className={\`badge \${item.type === "Satilik" ? "badge-brand" : ""}\`}>
              {item.type === "Satilik" ? "Satılık" : "Kiralık"}
            </span>
            {item.featured ? <span className="badge badge-gold">Öne Çıkan</span> : null}
          </div>

          <button
            onClick={onFav}
            aria-label="Favori"
            className="absolute right-4 top-4 z-10 btn"
            style={{ padding: "8px 10px" }}
          >
            {fav ? "❤️" : "🤍"}
          </button>

          {img ? (
            <img
              src={img}
              alt={item.title}
              className="h-48 w-full object-cover"
              loading="lazy"
              width="1100"
              height="600"
            />
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
            {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
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
`);

/* ========= Favorites page ========= */
w("pages/favorites.jsx", `import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import PropertyCard from "../components/PropertyCard";
import data from "../data/listings.json";
import { getFavorites } from "../lib/favorites";

export default function FavoritesPage(){
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(getFavorites());
    const onStorage = () => setIds(getFavorites());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = useMemo(() => {
    const all = (data.items || []).filter(x => x.status === "Yayinda");
    const set = new Set(ids.map(String));
    return all.filter(x => set.has(String(x.id)));
  }, [ids]);

  return (
    <Layout
      title="Favoriler | MyLifeVilla"
      desc="Beğendiğin ilanları burada topla."
      path="/favorites"
    >
      <div className="card p-6 page-text">
        <div className="text-2xl font-extrabold tracking-tight">Favoriler</div>
        <p className="mt-2 muted">Kalp ile eklediğin ilanlar burada görünür.</p>
      </div>

      <section className="mt-4">
        {items.length === 0 ? (
          <div className="card p-10 muted page-text">Henüz favorin yok. İlanlarda 🤍 ikonuna bas.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
`);

/* ========= Navbar: Favoriler linki ekle ========= */
w("components/Navbar.jsx", `export default function Navbar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="lux-topbar" />
      <div className="border-b hairline bg-white/70 backdrop-blur">
        <div className="container-max h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="MyLifeVilla"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-2">
            <a className="btn" href="/favorites">Favoriler</a>
            <a className="btn btn-primary" href="/">İlanlar</a>
          </div>
        </div>
      </div>
    </header>
  );
}
`);

console.log("✅ Pack-3 OK: auto filter options + price sliders + favorites + green background + favorites page + navbar link.");
console.log("➡️ Sonra: npm run build && npm run export && git add . && git commit -m \"Auto filters + sliders + favorites\" && git push");
