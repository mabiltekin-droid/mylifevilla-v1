const fs = require("fs");
const path = require("path");

function w(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
}

/* =============== Floating WhatsApp =============== */
w("components/FloatingWhatsApp.jsx", `
export default function FloatingWhatsApp({ phone, title }) {
  if (!phone) return null;

  const clean = String(phone).replace(/[^0-9]/g, "");
  const wa =
    clean.length === 10 ? "90" + clean :
    (clean.startsWith("90") ? clean : clean);

  const text = encodeURIComponent(\`Merhaba, "\${title}" ilanı hakkında bilgi alabilir miyim?\`);
  const href = \`https://wa.me/\${wa}?text=\${text}\`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 shadow-xl"
      aria-label="WhatsApp ile yaz"
      title="WhatsApp ile yaz"
    >
      <span className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-extrabold border hairline bg-emerald-600 text-white hover:bg-emerald-700">
        <span className="text-lg">💬</span>
        WhatsApp
      </span>
    </a>
  );
}
`);

/* =============== Navbar: Admin linkini kaldır =============== */
w("components/Navbar.jsx", `
export default function Navbar() {
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
        </div>
      </div>
    </header>
  );
}
`);

/* =============== Home: "İlan ekle" + "İpucu" kalksın =============== */
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
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 badge bg-slate-100 text-slate-800">
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

/* =============== Listing: Harita tam genişlik + Benzer ilanlar + Floating WhatsApp =============== */
w("pages/listing/[id].jsx", `import { useMemo } from "react";
import Layout from "../../components/Layout";
import Gallery from "../../components/Gallery";
import WhatsAppButton from "../../components/WhatsAppButton";
import FloatingWhatsApp from "../../components/FloatingWhatsApp";
import MapEmbed from "../../components/MapEmbed";
import PropertyCard from "../../components/PropertyCard";
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
  const mapQ = item?.mapQuery || item?.address || "";
  const allLive = useMemo(() => (data.items || []).filter(x => x.status === "Yayinda"), []);

  const similar = useMemo(() => {
    if (!item) return [];
    return allLive
      .filter(x =>
        x.id !== item.id &&
        x.district === item.district &&
        x.type === item.type
      )
      .slice(0, 6);
  }, [allLive, item]);

  if (!item) return null;

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <a className="btn" href="/">← Geri</a>
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
        </aside>
      </section>

      {/* Harita TAM GENİŞLİK */}
      {mapQ ? (
        <section className="mt-4 space-y-3">
          <MapEmbed query={mapQ} />

          <a
            className="btn btn-primary w-full text-center"
            target="_blank"
            rel="noreferrer"
            href={\`https://www.google.com/maps/dir/?api=1&destination=\${encodeURIComponent(mapQ)}\`}
          >
            📍 Yol tarifi al
          </a>
        </section>
      ) : null}

      {/* Benzer ilanlar */}
      {similar.length ? (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold">Benzer ilanlar</h2>
            <div className="text-sm muted">{item.district} • {item.type}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map((x) => <PropertyCard key={x.id} item={x} />)}
          </div>
        </section>
      ) : null}

      {/* Floating WhatsApp */}
      <FloatingWhatsApp phone={item.phone} title={item.title} />
    </Layout>
  );
}
`);

console.log("✅ UI güncellendi: floating WhatsApp, full-width harita, benzer ilanlar, ana sayfa temizlendi.");
