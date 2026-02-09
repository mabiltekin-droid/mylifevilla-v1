const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };

console.log("▶ apply-pack-2 running...");

/* ========= 1) pages/index.jsx : URL query <-> state sync + skeleton ========= */
w("pages/index.jsx", `import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import FilterBar from "../components/FilterBar";
import PropertyCard from "../components/PropertyCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
import data from "../data/listings.json";

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

  // Mini skeleton (premium hissi)
  const [pending, setPending] = useState(false);

  const liveItems = useMemo(
    () => (data.items || []).filter((x) => x.status === "Yayinda"),
    []
  );

  const featured = useMemo(
    () => liveItems.filter((x) => x.featured),
    [liveItems]
  );

  // 1) URL -> State (ilk yüklemede)
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
  }, [router.isReady]); // sadece ilk hazır olunca

  // 2) State -> URL (değişince URL güncelle; paylaşılabilir link)
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

    // yazarken URL spam olmasın diye q için minik debounce
    const t = setTimeout(() => {
      router.replace({ pathname: "/", query: next }, undefined, { shallow: true, scroll: false });
    }, q ? 250 : 0);

    return () => clearTimeout(t);
  }, [router.isReady, hydrated, q, district, type, minPrice, maxPrice, sort]);

  // Skeleton tetikle (filtre her değiştiğinde kısa anim)
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
      <section className="card p-6 overflow-hidden">
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

        {pending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
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
          <div className="card p-10 muted">Sonuç yok. Filtreleri sıfırla.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((item) => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
`);

/* ========= 2) styles/globals.css : skeleton class ekle (varsa bozmadan) ========= */
const cssPath = "styles/globals.css";
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".skeleton")) {
  css += `

/* ===== Skeleton (premium) ===== */
.skeleton{
  background: linear-gradient(90deg, rgba(15,23,42,.06), rgba(15,23,42,.10), rgba(15,23,42,.06));
  background-size: 200% 100%;
  animation: sk 1.05s ease-in-out infinite;
}
@keyframes sk{
  0%{ background-position: 200% 0; }
  100%{ background-position: -200% 0; }
}
`;
  fs.writeFileSync(cssPath, css, "utf8");
}

/* ========= 3) pages/listing/[id].jsx : WhatsApp butonu ekle =========
   Not: item.phone yoksa default numara kullanır. Sonradan listings.json'a phone ekleyebilirsin.
*/
w("pages/listing/[id].jsx", `import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import listings from "../../data/listings.json";
import { toAbsUrl } from "../../lib/seo";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

function normalizePhone(p){
  const s = String(p || "").replace(/[^0-9]/g, "");
  // 90 ile başlamıyorsa TR varsay (çok kaba ama iş görür)
  if (!s) return "";
  if (s.startsWith("90")) return s;
  if (s.startsWith("0")) return "9" + s; // 0xxxxxxxxxx -> 90xxxxxxxxxx
  return "90" + s;
}

export async function getStaticPaths() {
  const items = (listings?.items || []);
  const paths = items.map((item) => ({
    params: { id: String(item.id) },
  }));
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

  // WhatsApp
  const rawPhone = item.phone || item.contactPhone || item.whatsapp || "";
  const phone = normalizePhone(rawPhone) || "905000000000"; // <- burayı kendi numaranla değiştir
  const waText = encodeURIComponent(\`Merhaba, "\${item.title}" ilanı hakkında bilgi almak istiyorum.\\n\\nLink: \${typeof window !== "undefined" ? window.location.href : ""}\`);
  const waLink = \`https://wa.me/\${phone}?text=\${waText}\`;

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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="font-extrabold text-slate-900">Açıklama</div>
              <p className="mt-2 muted whitespace-pre-line">
                {item.description || "Açıklama eklenecek."}
              </p>
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
                  <a className="btn btn-primary w-full" href={waLink} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                  <a className="btn w-full" href="/">
                    Tüm ilanlara dön
                  </a>
                </div>

                <div className="pt-2 text-xs muted">
                  * WhatsApp numarası için listings.json'a <span className="font-bold">phone</span> alanı ekleyebilirsin.
                </div>
              </div>
            </div>
          </div>
        </div>

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

console.log("✅ Pack-2 OK: URL filtre sync + skeleton + WhatsApp butonu eklendi.");
console.log("➡️ Sonra: npm run build && npm run export && git add . && git commit -m \"URL filters + WhatsApp\" && git push");
