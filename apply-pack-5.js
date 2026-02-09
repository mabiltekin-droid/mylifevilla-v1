const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");

console.log("▶ apply-pack-5 running...");

/* ========= 0) compare + helpers ========= */
w("lib/compare.js", `const KEY = "mylifevilla:compare";

export function getCompare(){
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch { return []; }
}

export function setCompare(ids){
  if (typeof window === "undefined") return;
  const uniq = Array.from(new Set((ids || []).map(String))).slice(0, 3);
  localStorage.setItem(KEY, JSON.stringify(uniq));
}

export function toggleCompare(id){
  const sid = String(id);
  const cur = getCompare();
  let next = cur.includes(sid) ? cur.filter(x => x !== sid) : [...cur, sid];
  next = Array.from(new Set(next)).slice(0, 3);
  setCompare(next);
  return next;
}

export function isCompared(id){
  return getCompare().includes(String(id));
}
`);

w("lib/date.js", `export function isNew(createdAt, days=7){
  if (!createdAt) return false;
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return false;
  const ms = days * 24 * 60 * 60 * 1000;
  return (Date.now() - d.getTime()) <= ms;
}
`);

/* ========= 1) Leaflet map component ========= */
w("components/ListingMap.jsx", `import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

// lat/lng yoksa ilçe merkezini yaklaşık koy
function fallbackLatLng(item){
  const d = String(item?.district || "").toLowerCase();
  if (d.includes("pendik")) return { lat: 40.879, lng: 29.258 };
  if (d.includes("tuzla")) return { lat: 40.816, lng: 29.301 };
  // İstanbul geneli (son çare)
  return { lat: 41.0082, lng: 28.9784 };
}

export default function ListingMap({ items = [] }){
  const points = items.map((x) => {
    const lat = Number(x.lat);
    const lng = Number(x.lng);
    const ok = Number.isFinite(lat) && Number.isFinite(lng);
    const pos = ok ? { lat, lng } : fallbackLatLng(x);
    return { ...x, _pos: pos, _ok: ok };
  });

  const center = points.length ? points[0]._pos : { lat: 40.879, lng: 29.258 };

  return (
    <div className="card overflow-hidden page-text">
      <div className="p-4 border-b hairline flex items-center justify-between">
        <div className="font-extrabold">Harita</div>
        <div className="text-xs muted">Pin’e tıkla → ilan</div>
      </div>

      <div style={{ height: 420 }}>
        <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((x) => (
            <Marker key={x.id} position={[x._pos.lat, x._pos.lng]}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>{x.title}</div>
                  <div style={{ fontSize: 12, opacity: .8 }}>{x.city} / {x.district}</div>
                  <div style={{ marginTop: 6, fontWeight: 800 }}>{formatTRY(x.price)} ₺</div>
                  <div style={{ marginTop: 8 }}>
                    <Link href={\`/listing/\${x.id}\`} style={{ fontWeight: 800 }}>İlana git →</Link>
                  </div>
                  {!x._ok ? <div style={{ marginTop: 6, fontSize: 11, opacity: .7 }}>* Yaklaşık konum</div> : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
`);

/* ========= 2) ScrollToTop button ========= */
w("components/ScrollToTop.jsx", `import { useEffect, useState } from "react";

export default function ScrollToTop(){
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      className="btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ position:"fixed", right:16, bottom:16, zIndex:60 }}
      aria-label="Yukarı çık"
    >
      ↑ Yukarı
    </button>
  );
}
`);

/* ========= 3) Home: map section + sticky filter wrapper + compare bar ========= */
w("pages/index.jsx", `import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import FilterBar from "../components/FilterBar";
import PropertyCard from "../components/PropertyCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
import ScrollToTop from "../components/ScrollToTop";
import data from "../data/listings.json";

const ListingMap = dynamic(() => import("../components/ListingMap"), { ssr: false });

function normalize(s) {
  return (s || "").toString().toLowerCase().trim();
}

function pickQuery(routerQuery, key, fallback = "") {
  const v = routerQuery?.[key];
  if (typeof v === "string") return v;
  return fallback;
}

function cleanQuery(obj){
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (!s.length) continue;
    out[k] = s;
  }
  return out;
}

export default function Home() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");

  const [pending, setPending] = useState(false);

  const liveItems = useMemo(
    () => (data.items || []).filter((x) => x.status === "Yayinda"),
    []
  );

  const featured = useMemo(
    () => liveItems.filter((x) => x.featured),
    [liveItems]
  );

  useEffect(() => {
    if (!router.isReady) return;

    const qq = pickQuery(router.query, "q", "");
    const dd = pickQuery(router.query, "district", "ALL");
    const tt = pickQuery(router.query, "type", "ALL");
    const min = pickQuery(router.query, "min", "");
    const max = pickQuery(router.query, "max", "");
    const ss = pickQuery(router.query, "sort", "featured");

    setQ(qq);
    setDistrict(dd || "ALL");
    setType(tt || "ALL");
    setMinPrice(min);
    setMaxPrice(max);
    setSort(ss || "featured");

    setHydrated(true);
  }, [router.isReady]);

  useEffect(() => {
    if (!router.isReady || !hydrated) return;

    const next = cleanQuery({
      q: q || "",
      district: district !== "ALL" ? district : "",
      type: type !== "ALL" ? type : "",
      min: minPrice !== "" ? minPrice : "",
      max: maxPrice !== "" ? maxPrice : "",
      sort: sort !== "featured" ? sort : "",
    });

    const t = setTimeout(() => {
      router.replace({ pathname: "/", query: next }, undefined, { shallow: true, scroll: false });
    }, q ? 250 : 0);

    return () => clearTimeout(t);
  }, [router.isReady, hydrated, q, district, type, minPrice, maxPrice, sort]);

  useEffect(() => {
    if (!hydrated) return;
    setPending(true);
    const t = setTimeout(() => setPending(false), 180);
    return () => clearTimeout(t);
  }, [hydrated, q, district, type, minPrice, maxPrice, sort]);

  const listings = useMemo(() => {
    const items = liveItems;
    const qn = normalize(q);
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;

    let filtered = items.filter((x) => {
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
  }, [liveItems, q, district, type, minPrice, maxPrice, sort]);

  const onReset = () => {
    setQ("");
    setDistrict("ALL");
    setType("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  };

  return (
    <Layout
      title="MyLifeVilla | Pendik & Tuzla Emlak"
      desc="Pendik ve Tuzla bölgesinde satılık & kiralık emlak ilanları. Öne çıkan ilanlar, filtreleme ve detay sayfaları."
      path="/"
    >
      <section className="card p-6 overflow-hidden page-text">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 badge badge-gold">
            ✨ Premium • Pendik • Tuzla
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight">
            Hayalindeki evi hızlıca bul
          </h1>
          <p className="mt-2 muted">
            Filtrele, vitrine bak, ilan detayında galeri + WhatsApp ile hızlı iletişim kur.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="card px-4 py-3">
              <div className="text-xs font-extrabold muted">Yayındaki ilan</div>
              <div className="text-xl font-extrabold">{liveItems.length}</div>
            </div>
            <div className="card px-4 py-3">
              <div className="text-xs font-extrabold muted">Vitrin</div>
              <div className="text-xl font-extrabold">{featured.length}</div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedCarousel items={featured} />

      {/* Sticky Filter */}
      <div className="mt-4 sticky top-[76px] z-20">
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

      {/* Map (top results) */}
      <div className="mt-4">
        <ListingMap items={listings.slice(0, 30)} />
      </div>

      <section className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm" style={{ color: "rgba(234,242,239,.85)" }}>
            <span className="font-extrabold" style={{ color:"#eaf2ef" }}>{listings.length}</span> ilan bulundu
          </div>
          <a className="btn" href="/compare">Karşılaştır</a>
        </div>

        {pending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden page-text">
                <div className="h-48 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 skeleton rounded" />
                  <div className="h-3 w-1/2 skeleton rounded" />
                  <div className="h-6 w-2/3 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="card p-10 muted page-text">Sonuç yok. Filtreleri sıfırla.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      <ScrollToTop />
    </Layout>
  );
}
`);

/* ========= 4) PropertyCard: NEW badge + Compare checkbox ========= */
w("components/PropertyCard.jsx", `import Link from "next/link";
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
    <Link href={\`/listing/\${item.id}\`} className="block">
      <div className="card card-hover overflow-hidden">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className={\`badge \${item.type === "Satilik" ? "badge-brand" : ""}\`}>
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

/* ========= 5) Compare page ========= */
w("pages/compare.jsx", `import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import data from "../data/listings.json";
import { getCompare, setCompare } from "../lib/compare";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export default function ComparePage(){
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(getCompare());
    const onStorage = () => setIds(getCompare());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = useMemo(() => {
    const all = (data.items || []).filter(x => x.status === "Yayinda");
    const set = new Set(ids.map(String));
    return all.filter(x => set.has(String(x.id)));
  }, [ids]);

  const remove = (id) => {
    const next = ids.filter(x => x !== String(id));
    setCompare(next);
    setIds(next);
  };

  return (
    <Layout title="Karşılaştır | MyLifeVilla" desc="İlanları yan yana karşılaştır." path="/compare">
      <div className="card p-6 page-text">
        <div className="text-2xl font-extrabold tracking-tight">Karşılaştır</div>
        <p className="mt-2 muted">Kartlardaki ☑ ile en fazla 3 ilan seç.</p>
      </div>

      {items.length === 0 ? (
        <div className="card p-10 mt-4 muted page-text">Seçili ilan yok. Ana sayfadan ☑ ekle.</div>
      ) : (
        <div className="card p-6 mt-4 page-text overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b hairline">
                <th className="text-left py-3">Alan</th>
                {items.map(it => (
                  <th key={it.id} className="text-left py-3">
                    <div className="font-extrabold">{it.title}</div>
                    <button className="btn mt-2" onClick={() => remove(it.id)}>Kaldır</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Fiyat", (it) => \`\${formatTRY(it.price)} ₺\`],
                ["İlçe", (it) => \`\${it.city} / \${it.district}\`],
                ["Mahalle", (it) => it.neighborhood || "-"],
                ["Oda", (it) => it.rooms || "-"],
                ["m²", (it) => it.area || "-"],
                ["Tip", (it) => it.type === "Satilik" ? "Satılık" : it.type === "Kiralik" ? "Kiralık" : it.type],
              ].map(([label, fn]) => (
                <tr key={label} className="border-b hairline">
                  <td className="py-3 font-extrabold">{label}</td>
                  {items.map(it => <td key={it.id + label} className="py-3">{fn(it)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <a className="btn btn-primary" href="/">İlanlara dön</a>
          </div>
        </div>
      )}
    </Layout>
  );
}
`);

/* ========= 6) Listing detail: WhatsApp message personalize + thumbnails strip ========= */
w("pages/listing/[id].jsx", `import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import listings from "../../data/listings.json";
import { toAbsUrl } from "../../lib/seo";
import { isFav, toggleFav } from "../../lib/favorites";
import { isCompared, toggleCompare } from "../../lib/compare";
import { isNew } from "../../lib/date";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

function normalizePhone(p){
  const s = String(p || "").replace(/[^0-9]/g, "");
  if (!s) return "";
  if (s.startsWith("90")) return s;
  if (s.startsWith("0")) return "9" + s;
  return "90" + s;
}

export async function getStaticPaths() {
  const items = (listings?.items || []);
  const paths = items.map((item) => ({ params: { id: String(item.id) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const id = String(params?.id ?? "");
  const item = (listings?.items || []).find((x) => String(x.id) === id);
  if (!item) return { notFound: true };
  return { props: { item } };
}

export default function ListingDetail({ item }) {
  const images = useMemo(() => (item?.images || []).filter(Boolean), [item]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const [fav, setFav] = useState(false);
  const [cmp, setCmp] = useState(false);

  useEffect(() => {
    setFav(isFav(item.id));
    setCmp(isCompared(item.id));
  }, [item.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (!open) return;
      if (e.key === "ArrowRight") setIdx((v) => Math.min(v + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIdx((v) => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  const cover = images[0] || "/og.jpg";
  const title = \`\${item.title} | MyLifeVilla\`;
  const desc = \`\${item.city} / \${item.district}\${item.neighborhood ? " - " + item.neighborhood : ""} • \${formatTRY(item.price)} ₺ • \${item.area || ""} m²\`.trim();

  const newly = isNew(item.createdAt, 7);

  // WhatsApp
  const rawPhone = item.phone || item.contactPhone || item.whatsapp || "";
  const phone = normalizePhone(rawPhone) || "905000000000"; // <- kendi numaranla değiştir
  const waText = encodeURIComponent(
    \`Merhaba!\\n\\nİlan: \${item.title}\\nFiyat: \${formatTRY(item.price)} ₺\\nDetay: \${item.area || "-"} m² • \${item.rooms || "-"}\\nKonum: \${item.district}\${item.neighborhood ? " / " + item.neighborhood : ""}\\n\\nLink: \${typeof window !== "undefined" ? window.location.href : ""}\\n\\nBilgi alabilir miyim?\`
  );
  const waLink = \`https://wa.me/\${phone}?text=\${waText}\`;

  const onFav = () => {
    const next = toggleFav(item.id);
    setFav(next.includes(String(item.id)));
  };
  const onCmp = () => {
    const next = toggleCompare(item.id);
    setCmp(next.includes(String(item.id)));
  };

  return (
    <Layout title={title} desc={desc} image={toAbsUrl(cover)} path={\`/listing/\${item.id}\`}>
      <div className="card overflow-hidden page-text">
        <div className="p-6 border-b hairline">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                {item.title}
              </h1>
              <div className="mt-2 muted">
                {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className={\`badge \${item.type === "Satilik" ? "badge-brand" : ""}\`}>
                  {item.type === "Satilik" ? "Satılık" : "Kiralık"}
                </span>
                {item.featured ? <span className="badge badge-gold">Öne Çıkan</span> : null}
                {newly ? <span className="badge" style={{ borderColor:"rgba(231,200,115,.45)", background:"rgba(231,200,115,.18)" }}>🆕 Yeni</span> : null}

                <button className="btn" onClick={onCmp}>{cmp ? "☑ Karşılaştır" : "☐ Karşılaştır"}</button>
                <button className="btn" onClick={onFav}>{fav ? "❤️ Favori" : "🤍 Favori"}</button>
              </div>
            </div>

            <div className="text-right space-y-3">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {formatTRY(item.price)} ₺
                </div>
                <div className="mt-1 text-sm muted">
                  {item.area ? <span className="font-bold text-slate-700">{item.area}</span> : null} m²
                  {item.rooms ? <span> • <span className="font-bold text-slate-700">{item.rooms}</span></span> : null}
                </div>
              </div>

              <a className="btn btn-primary" href={waLink} target="_blank" rel="noreferrer">
                WhatsApp ile iletişim
              </a>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Main image */}
          <button
            className="w-full overflow-hidden rounded-2xl border hairline bg-white/70 zoom-wrap"
            onClick={() => { if (!images.length) return; setIdx(0); setOpen(true); }}
            style={{ aspectRatio: "16/9" }}
          >
            {images[0] ? (
              <img src={images[0]} alt={item.title} className="w-full h-full object-cover zoom-img" loading="lazy" width="1400" height="788" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <div className="text-center">
                  <div className="text-2xl">🖼️</div>
                  <div className="mt-1 text-sm muted">Fotoğraf eklenecek</div>
                </div>
              </div>
            )}
          </button>

          {/* Thumbnails */}
          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.slice(0, 12).map((src, i) => (
                <button
                  key={i}
                  className="shrink-0 w-28 h-20 overflow-hidden rounded-xl border hairline bg-white"
                  onClick={() => { setIdx(i); setOpen(true); }}
                  title="Büyüt"
                >
                  <img src={src} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="font-extrabold text-slate-900">Açıklama</div>
              <p className="mt-2 muted whitespace-pre-line">{item.description || "Açıklama eklenecek."}</p>
            </div>

            <div className="card p-5">
              <div className="font-extrabold text-slate-900">Hızlı İşlem</div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="muted">İlçe</span>
                  <span className="font-bold text-slate-900">{item.district}</span>
                </div>
                {item.neighborhood ? (
                  <div className="flex justify-between gap-3">
                    <span className="muted">Mahalle</span>
                    <span className="font-bold text-slate-900">{item.neighborhood}</span>
                  </div>
                ) : null}

                <div className="pt-3 space-y-2">
                  <a className="btn btn-primary w-full" href={waLink} target="_blank" rel="noreferrer">WhatsApp</a>
                  <a className="btn w-full" href="/compare">Karşılaştır’a git</a>
                  <a className="btn w-full" href="/">Tüm ilanlara dön</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {open ? (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-3">
                <button className="btn" onClick={() => setOpen(false)}>Kapat</button>
              </div>
              <div className="overflow-hidden rounded-3xl border hairline bg-black">
                <img src={images[idx]} alt={item.title} className="w-full max-h-[75vh] object-contain bg-black" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button className="btn" onClick={() => setIdx((v) => Math.max(v - 1, 0))}>←</button>
                <div className="text-white/80 text-sm">{idx + 1} / {images.length}</div>
                <button className="btn" onClick={() => setIdx((v) => Math.min(v + 1, images.length - 1))}>→</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
`);

/* ========= 7) globals.css: zoom helper + leaflet polish + sticky blur ========= */
{
  const cssPath = "styles/globals.css";
  let css = exists(cssPath) ? read(cssPath) : "";
  if (!css.includes("/* ===== Map + Zoom Pack ===== */")) {
    css += `

/* ===== Map + Zoom Pack ===== */
.zoom-wrap{ position: relative; overflow: hidden; }
.zoom-img{ transition: transform .25s ease; }
.zoom-wrap:hover .zoom-img{ transform: scale(1.05); }

/* Sticky filter daha premium dursun */
.sticky > .card{
  box-shadow: 0 18px 46px rgba(2,6,23,.12);
}

/* Leaflet font */
.leaflet-container{ font-family: inherit; }
`;
    fs.writeFileSync(cssPath, css, "utf8");
  }
}

console.log("✅ Pack-5 OK: map + new badge + gallery thumbs/zoom + compare + WA personalize + sticky filter + scroll-top.");
console.log("➡️ Sonra: npm run build && npm run export && git add . && git commit -m \"Map + compare + new badge + gallery\" && git push");
