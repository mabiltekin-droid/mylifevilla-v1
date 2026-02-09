const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");

const SITE_URL = "https://mylifevilla.netlify.app";

/* ========= 1) Premium globals.css (senin attığın style) ========= */
w("styles/globals.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== Base ===== */
:root{
  --brand:#0f3d2e;
  --brand2:#145c43;
  --gold:#c7a14a;
  --gold2:#e7c873;
}

body{
  background: radial-gradient(1200px 500px at 50% -200px, rgba(15,61,46,.18), transparent 60%),
              linear-gradient(180deg, #fbfbfa 0%, #f5f6f7 100%);
  color:#0f172a;
}

.container-max{
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

.hairline{ border-color: rgba(15,23,42,.10); }

.muted{ color: rgba(15,23,42,.65); }

/* ===== Cards ===== */
.card{
  @apply rounded-3xl border bg-white/85 backdrop-blur;
  border-color: rgba(15,23,42,.10);
  box-shadow:
    0 1px 0 rgba(255,255,255,.6) inset,
    0 10px 30px rgba(2,6,23,.06);
}

.card-hover{
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card-hover:hover{
  transform: translateY(-2px);
  border-color: rgba(199,161,74,.28);
  box-shadow:
    0 1px 0 rgba(255,255,255,.7) inset,
    0 18px 46px rgba(2,6,23,.12);
}

/* ===== Buttons ===== */
.btn{
  @apply inline-flex items-center justify-center rounded-full px-4 py-2 font-extrabold;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(255,255,255,.85);
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}
.btn:hover{
  background: rgba(255,255,255,.95);
  border-color: rgba(15,23,42,.18);
}
.btn:active{ transform: translateY(1px); }

.btn-primary{
  border-color: rgba(15,61,46,.15);
  background: linear-gradient(180deg, var(--brand) 0%, #0c2f24 100%);
  color: white;
  box-shadow: 0 10px 24px rgba(15,61,46,.20);
}
.btn-primary:hover{
  background: linear-gradient(180deg, var(--brand2) 0%, var(--brand) 100%);
  border-color: rgba(199,161,74,.25);
}

/* ===== Badges ===== */
.badge{
  @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.8);
}
.badge-brand{
  border-color: rgba(15,61,46,.18);
  background: rgba(15,61,46,.10);
  color: var(--brand);
}
.badge-gold{
  border-color: rgba(199,161,74,.25);
  background: rgba(199,161,74,.14);
  color: #7a5a12;
}

/* ===== Header line (luxury) ===== */
.lux-topbar{
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
`);

/* ========= 2) PropertyCard (premium + placeholder + CLS fix) ========= */
w("components/PropertyCard.jsx", `import Link from "next/link";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export default function PropertyCard({ item }) {
  const img = (item.images || []).find(Boolean);

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

        <div className="p-5">
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

/* ========= 3) Navbar (lux topbar + premium button) ========= */
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

          <a className="btn btn-primary" href="/">
            İlanlar
          </a>
        </div>
      </div>
    </header>
  );
}
`);

/* ========= 4) SEO helper ========= */
w("lib/seo.js", `export const SITE_URL = "${SITE_URL}";

export function toAbsUrl(url){
  if (!url) return "";
  if (String(url).startsWith("http")) return url;
  return SITE_URL.replace(/\\/$/,"") + "/" + String(url).replace(/^\\//,"");
}

export function safeText(s, fallback=""){
  const t = (s ?? "").toString().trim();
  return t.length ? t : fallback;
}
`);

/* ========= 5) Layout: global Head SEO ========= */
w("components/Layout.jsx", `import Head from "next/head";
import Navbar from "./Navbar";
import { SITE_URL, safeText, toAbsUrl } from "../lib/seo";

export default function Layout({
  children,
  title = "MyLifeVilla | Pendik & Tuzla Emlak",
  desc = "Pendik ve Tuzla bölgesinde satılık & kiralık emlak ilanları. Öne çıkan ilanlar, filtreleme ve detay sayfaları.",
  image = "/og.jpg",
  path = "/",
}) {
  const metaTitle = safeText(title, "MyLifeVilla");
  const metaDesc = safeText(desc, "Pendik ve Tuzla emlak ilanları.");
  const canonical = SITE_URL.replace(/\\/$/,"") + safeText(path, "/");
  const ogImage = toAbsUrl(image);

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <Navbar />
      <main className="container-max py-8">{children}</main>
    </>
  );
}
`);

/* ========= 6) 404 page ========= */
w("pages/404.jsx", `import Layout from "../components/Layout";

export default function NotFound(){
  return (
    <Layout
      title="Sayfa bulunamadı | MyLifeVilla"
      desc="Aradığın sayfa bulunamadı. İlanlara geri dönebilirsin."
      path="/404"
    >
      <div className="card p-8">
        <div className="text-2xl font-extrabold tracking-tight">Sayfa bulunamadı</div>
        <p className="mt-2 muted">
          Link hatalı olabilir veya ilan kaldırılmış olabilir.
        </p>
        <div className="mt-6">
          <a className="btn btn-primary" href="/">İlanlara dön</a>
        </div>
      </div>
    </Layout>
  );
}
`);

/* ========= 7) Listing detail: item yoksa 404 + dinamik SEO ========= */
w("pages/listing/[id].jsx", `import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import listings from "../../data/listings.json";
import { toAbsUrl } from "../../lib/seo";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export async function getStaticPaths() {
  const paths = (listings || []).map((item) => ({
    params: { id: String(item.id) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const id = String(params?.id ?? "");
  const item = (listings || []).find((x) => String(x.id) === id);

  if (!item) {
    return { notFound: true };
  }

  return { props: { item } };
}

export default function ListingDetail({ item }) {
  const images = useMemo(() => (item?.images || []).filter(Boolean), [item]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

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

  return (
    <Layout
      title={title}
      desc={desc}
      image={toAbsUrl(cover)}
      path={\`/listing/\${item.id}\`}
    >
      <div className="card overflow-hidden">
        <div className="p-6 border-b hairline">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                {item.title}
              </h1>
              <div className="mt-2 muted">
                {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={\`badge \${item.type === "Satilik" ? "badge-brand" : ""}\`}>
                  {item.type === "Satilik" ? "Satılık" : "Kiralık"}
                </span>
                {item.featured ? <span className="badge badge-gold">Öne Çıkan</span> : null}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold text-slate-900">
                {formatTRY(item.price)} ₺
              </div>
              <div className="mt-1 text-sm muted">
                {item.area ? <span className="font-bold text-slate-700">{item.area}</span> : null} m²
                {item.rooms ? <span> • <span className="font-bold text-slate-700">{item.rooms}</span></span> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(images.length ? images : [null, null, null]).slice(0, 6).map((src, i) => (
              <button
                key={i}
                className="overflow-hidden rounded-2xl border hairline bg-white/70"
                onClick={() => { if(!src) return; setIdx(i); setOpen(true); }}
                style={{ aspectRatio: "16/10" }}
              >
                {src ? (
                  <img src={src} alt={item.title} className="w-full h-full object-cover" loading="lazy" width="1200" height="750" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <div className="text-center">
                      <div className="text-2xl">🖼️</div>
                      <div className="mt-1 text-sm muted">Fotoğraf eklenecek</div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="font-extrabold text-slate-900">Açıklama</div>
              <p className="mt-2 muted whitespace-pre-line">
                {item.description || "Açıklama eklenecek."}
              </p>
            </div>

            <div className="card p-5">
              <div className="font-extrabold text-slate-900">Özet</div>
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
                {item.area ? (
                  <div className="flex justify-between gap-3">
                    <span className="muted">m²</span>
                    <span className="font-bold text-slate-900">{item.area}</span>
                  </div>
                ) : null}
                {item.rooms ? (
                  <div className="flex justify-between gap-3">
                    <span className="muted">Oda</span>
                    <span className="font-bold text-slate-900">{item.rooms}</span>
                  </div>
                ) : null}
                <div className="pt-3">
                  <a className="btn btn-primary w-full" href="/">
                    Tüm ilanlara dön
                  </a>
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
                <img
                  src={images[idx]}
                  alt={item.title}
                  className="w-full max-h-[75vh] object-contain bg-black"
                />
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

/* ========= 8) robots.txt ========= */
w("public/robots.txt", `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

/* ========= 9) sitemap.xml (listings.json’dan otomatik üret) ========= */
function normalizeListings(json){
  if (!json) return [];

  // Direkt array ise
  if (Array.isArray(json)) return json;

  // Yaygın olası şekiller
  if (Array.isArray(json.listings)) return json.listings;
  if (Array.isArray(json.items)) return json.items;
  if (Array.isArray(json.data)) return json.data;

  // "edges/nodes" gibi CMS şekilleri
  if (json.edges && Array.isArray(json.edges)) {
    return json.edges.map(e => e?.node).filter(Boolean);
  }

  // Tek ilan objesi gelirse
  if (typeof json === "object") return [json];

  return [];
}

function makeSitemap(){
  const dataPath = "data/listings.json";
  let raw = null;

  try {
    raw = JSON.parse(read(dataPath));
  } catch (e) {
    raw = null;
  }

  const list = normalizeListings(raw);

  const urls = [
    { loc: SITE_URL + "/", priority: "1.0" },
    ...list
      .map((x) => {
        const id = x?.id ?? x?.slug ?? x?._id ?? x?.uuid;
        if (id == null) return null;
        return {
          loc: SITE_URL + "/listing/" + encodeURIComponent(String(id)),
          priority: "0.8",
        };
      })
      .filter(Boolean),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

  w("public/sitemap.xml", xml);
}
makeSitemap();
/* ========= 10) Ensure _app imports globals.css ========= */
const appPath = "pages/_app.jsx";
if (exists(appPath)) {
  const app = read(appPath);
  if (!app.includes('import "../styles/globals.css"') && !app.includes('import "../styles/globals.css";')) {
    w(appPath, `import "../styles/globals.css";\n` + app);
  }
}

console.log("✅ Hepsi uygulandı: premium tema + SEO + 404 + robots + sitemap + listing 404 + dinamik meta.");
console.log("➡️ Sonraki adım: npm run build && npm run export (veya netlify deploy akışın neyse).");
