const fs = require("fs");
const path = require("path");

function w(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
}

/* =========================
   COMPONENTS
========================= */

w("components/Gallery.jsx", `
import { useEffect, useMemo, useRef, useState } from "react";

export default function Gallery({ images = [], title = "Foto" }) {
  const list = useMemo(() => (images || []).filter(Boolean), [images]);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef(null);
  const deltaX = useRef(0);

  const has = list.length > 0;
  const active = has ? (list[i] || list[0]) : null;

  const prev = () => setI((x) => (x - 1 + list.length) % list.length);
  const next = () => setI((x) => (x + 1) % list.length);

  useEffect(() => {
    const onKey = (e) => {
      if (!open || list.length < 2) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, list.length]);

  const onPointerDown = (e) => {
    if (list.length < 2) return;
    startX.current = e.clientX;
    deltaX.current = 0;
  };

  const onPointerMove = (e) => {
    if (startX.current == null) return;
    deltaX.current = e.clientX - startX.current;
  };

  const onPointerUp = () => {
    if (startX.current == null) return;
    const dx = deltaX.current;
    startX.current = null;
    deltaX.current = 0;
    // swipe threshold
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev();
      else next();
    }
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div
          className="relative aspect-[21/11] bg-slate-100 select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {active ? (
            <button className="w-full h-full block" onClick={() => setOpen(true)} title="Büyüt">
              <img
                src={active}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-200"
                loading="lazy"
              />
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Fotoğraf yok
            </div>
          )}

          {list.length > 1 ? (
            <>
              <div className="absolute top-3 right-3 badge bg-black/60 text-white">
                {i + 1}/{list.length}
              </div>

              <div className="absolute inset-y-0 left-3 flex items-center">
                <button className="btn bg-white/90" onClick={prev} aria-label="Önceki">←</button>
              </div>

              <div className="absolute inset-y-0 right-3 flex items-center">
                <button className="btn bg-white/90" onClick={next} aria-label="Sonraki">→</button>
              </div>
            </>
          ) : null}
        </div>

        {list.length > 1 ? (
          <div className="p-3 border-t hairline bg-white/70">
            <div className="flex gap-2 overflow-auto">
              {list.map((src, idx) => (
                <button
                  key={src + idx}
                  onClick={() => setI(idx)}
                  className={\`h-16 w-24 rounded-xl overflow-hidden border \${idx === i ? "border-slate-400" : "border-slate-200"}\`}
                  title={\`Foto \${idx + 1}\`}
                >
                  <img src={src} alt={\`thumb-\${idx}\`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="badge bg-white/90 text-slate-800">{title}</div>
              <button className="btn bg-white" onClick={() => setOpen(false)}>Kapat ✕</button>
            </div>

            <div className="card overflow-hidden">
              <div className="relative bg-slate-100">
                <img src={active} alt={title} className="w-full h-[70vh] object-contain" />
                {list.length > 1 ? (
                  <>
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <button className="btn bg-white" onClick={prev} aria-label="Önceki">←</button>
                    </div>
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <button className="btn bg-white" onClick={next} aria-label="Sonraki">→</button>
                    </div>
                    <div className="absolute top-3 right-3 badge bg-black/60 text-white">
                      {i + 1}/{list.length}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-2 text-sm text-white/80">
              İpucu: Klavye ← → ile gez, ESC ile kapat. Mobilde swipe çalışır.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
`);

w("components/FeaturedCarousel.jsx", `
import { useMemo, useRef } from "react";
import PropertyCard from "./PropertyCard";

export default function FeaturedCarousel({ items = [] }) {
  const list = useMemo(() => (items || []).filter(Boolean), [items]);
  const sc = useRef(null);

  const scrollBy = (dx) => {
    if (!sc.current) return;
    sc.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  if (list.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-extrabold">Vitrin</h2>
        <div className="flex gap-2">
          <button className="btn" onClick={() => scrollBy(-420)}>←</button>
          <button className="btn" onClick={() => scrollBy(420)}>→</button>
        </div>
      </div>

      <div ref={sc} className="flex gap-4 overflow-auto pb-2 snap-x snap-mandatory">
        {list.map((item) => (
          <div key={item.id} className="min-w-[280px] sm:min-w-[340px] snap-start">
            <PropertyCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
`);

w("components/WhatsAppButton.jsx", `
export default function WhatsAppButton({ phone, title }) {
  if (!phone) return null;
  const clean = String(phone).replace(/[^0-9]/g, "");
  // TR için +90 yoksa ekle (10 haneli gsm vs)
  const wa = clean.length === 10 ? "90" + clean : (clean.startsWith("90") ? clean : clean);
  const text = encodeURIComponent(\`Merhaba, "\${title}" ilanı hakkında bilgi alabilir miyim?\`);
  const href = \`https://wa.me/\${wa}?text=\${text}\`;

  return (
    <a className="btn btn-primary w-full" href={href} target="_blank" rel="noreferrer">
      WhatsApp ile yaz
    </a>
  );
}
`);

w("components/MapEmbed.jsx", `
export default function MapEmbed({ query }) {
  if (!query) return null;
  const src = "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b hairline">
        <div className="font-extrabold">Harita</div>
        <div className="text-sm muted mt-1">{query}</div>
      </div>
      <div className="aspect-[16/10] bg-slate-100">
        <iframe
          title="map"
          src={src}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
`);

/* =========================
   PAGES UPDATE
========================= */

w("pages/index.jsx", `import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import FilterBar from "../components/FilterBar";
import PropertyCard from "../components/PropertyCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
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

  const liveItems = useMemo(
    () => (data.items || []).filter((x) => x.status === "Yayinda"),
    []
  );

  const featured = useMemo(
    () => liveItems.filter((x) => x.featured),
    [liveItems]
  );

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
              Vitrin + filtre + galeri hazır. Yönetim: <span className="font-semibold text-slate-700">/admin</span>
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
              <a className="btn btn-primary" href="/admin/">İlan ekle</a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="card p-5 w-[360px]">
              <div className="text-sm font-extrabold">İpucu</div>
              <div className="mt-2 muted text-sm">
                İlan detayı içinde galeri: oklar, swipe, lightbox, sayaç.
              </div>
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

        {listings.length === 0 ? (
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

w("pages/listing/[id].jsx", `import { useMemo } from "react";
import Layout from "../../components/Layout";
import Gallery from "../../components/Gallery";
import WhatsAppButton from "../../components/WhatsAppButton";
import MapEmbed from "../../components/MapEmbed";
import data from "../../data/listings.json";

function formatTRY(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export async function getStaticPaths() {
  const paths = (data.items || [])
    .filter((x) => x.status === "Yayinda")
    .map((x) => ({ params: { id: x.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const item = (data.items || []).find((x) => x.id === params.id) || null;
  return { props: { item } };
}

export default function Detail({ item }) {
  const images = useMemo(() => (item?.images || []).filter(Boolean), [item]);
  if (!item) return null;

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <a className="btn" href="/">← Geri</a>
        <a className="btn btn-primary" href="/admin/">Admin</a>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Gallery images={images} title={item.title} />

          <div className="card p-6 mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={\`badge \${badge}\`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
              {item.featured ? <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span> : null}
              <span className="badge bg-slate-100 text-slate-800">{item.district}</span>
              {item.neighborhood ? <span className="badge bg-slate-100 text-slate-800">{item.neighborhood}</span> : null}
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

          <div className="mt-4">
            <MapEmbed query={item.mapQuery || item.address || ""} />
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-extrabold">Hızlı İletişim</h3>

            <div className="mt-3 grid gap-2">
              <WhatsAppButton phone={item.phone} title={item.title} />
              {item.phone ? (
                <a className="btn w-full" href={\`tel:\${String(item.phone).replace(/\\s+/g,"")}\`}>
                  Ara
                </a>
              ) : (
                <div className="text-sm muted">Bu ilana telefon eklenmemiş.</div>
              )}
            </div>

            <div className="mt-5 border-t hairline pt-4">
              <h4 className="font-extrabold">Özet</h4>
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
          </div>

          <div className="card p-6 mt-4 text-sm muted">
            Admin → İlanlar içinde <b>Telefon</b> ve <b>Harita sorgusu</b> alanlarını doldurursan WhatsApp + harita aktif olur.
          </div>
        </aside>
      </section>
    </Layout>
  );
}
`);

/* =========================
   CMS FIELDS (config.yml)
   - phone + address/mapQuery
========================= */

w("public/admin/config.yml", `backend:
  name: git-gateway
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "listings"
    label: "İlanlar"
    files:
      - file: "data/listings.json"
        label: "İlan Listesi"
        name: "listings"
        fields:
          - { label: "İlanlar", name: "items", widget: "list", fields: [
              { label: "ID", name: "id", widget: "string" },
              { label: "Durum", name: "status", widget: "select", options: ["Yayinda","Taslak"], default: "Yayinda" },
              { label: "Öne Çıkan", name: "featured", widget: "boolean", default: false, required: false },
              { label: "Tür", name: "type", widget: "select", options: ["Satilik","Kiralik"], default: "Satilik" },
              { label: "Başlık", name: "title", widget: "string" },
              { label: "Fiyat", name: "price", widget: "number" },
              { label: "Şehir", name: "city", widget: "string", default: "İstanbul" },
              { label: "İlçe", name: "district", widget: "select", options: ["Pendik","Tuzla"] },
              { label: "Mahalle", name: "neighborhood", widget: "string", required: false },
              { label: "m²", name: "area", widget: "number" },
              { label: "Oda", name: "rooms", widget: "string", required: false },
              { label: "Kat", name: "floor", widget: "string", required: false },
              { label: "Bina Yaşı", name: "age", widget: "number", required: false },
              { label: "Isınma", name: "heating", widget: "string", required: false },

              { label: "Telefon (WhatsApp için)", name: "phone", widget: "string", required: false },
              { label: "Adres (opsiyonel)", name: "address", widget: "string", required: false },
              { label: "Harita Sorgusu (ör: 'Pendik Marina' / tam adres)", name: "mapQuery", widget: "string", required: false },

              { label: "Açıklama", name: "description", widget: "text" },
              { label: "Görseller", name: "images", widget: "list", required: false, field: { label: "Görsel", name: "image", widget: "image" } }
            ] }
`);

console.log("✅ Ek özellikler yazıldı (galeri ok+swipe+sayac, vitrin carousel, whatsapp, harita, cms alanları)");
