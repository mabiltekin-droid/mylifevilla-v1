const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");

console.log("▶ apply-pack-6 running...");

/* ========= Components ========= */
w("components/ShareButtons.jsx", `import { useEffect, useMemo, useState } from "react";

export default function ShareButtons({ title }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  const shareText = useMemo(() => {
    const t = (title || "MyLifeVilla ilanı").toString();
    return encodeURIComponent(t + "\\n" + url);
  }, [title, url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link kopyalandı ✅");
    } catch {
      prompt("Kopyalamak için:", url);
    }
  };

  const wa = \`https://wa.me/?text=\${shareText}\`;
  const tg = \`https://t.me/share/url?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title || "MyLifeVilla ilanı")}\`;

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn" onClick={copy}>🔗 Linki kopyala</button>
      <a className="btn" href={wa} target="_blank" rel="noreferrer">📲 WhatsApp’ta paylaş</a>
      <a className="btn" href={tg} target="_blank" rel="noreferrer">✈️ Telegram</a>
    </div>
  );
}
`);

w("components/AdvisorCard.jsx", `function normalizePhone(p){
  const s = String(p || "").replace(/[^0-9]/g, "");
  if (!s) return "";
  if (s.startsWith("90")) return s;
  if (s.startsWith("0")) return "9" + s;
  return "90" + s;
}

export default function AdvisorCard({ item }) {
  // İlanda varsa kullan; yoksa default
  const name = item?.agentName || item?.advisorName || "MyLifeVilla Danışmanı";
  const role = item?.agentRole || "Gayrimenkul Danışmanı";
  const photo = item?.agentPhoto || "/logo.png";
  const office = item?.agentOffice || "MyLifeVilla • Pendik & Tuzla";
  const rawPhone = item?.phone || item?.contactPhone || item?.whatsapp || item?.agentPhone || "";
  const phone = normalizePhone(rawPhone) || "905000000000"; // <- kendi numaranı yazabilirsin

  const waText = encodeURIComponent(\`Merhaba! "\${item?.title || "ilan"}" için bilgi alabilir miyim?\\nLink: \${typeof window !== "undefined" ? window.location.href : ""}\`);
  const waLink = \`https://wa.me/\${phone}?text=\${waText}\`;
  const telLink = \`tel:+\${phone}\`;

  return (
    <div className="card p-5 page-text">
      <div className="flex items-center gap-3">
        <img src={photo} alt={name} className="w-14 h-14 rounded-2xl object-contain bg-white border hairline p-2" />
        <div>
          <div className="font-extrabold text-slate-900">{name}</div>
          <div className="text-sm muted">{role}</div>
          <div className="text-xs muted mt-1">{office}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="badge badge-gold">✅ Doğrulanmış</span>
        <span className="badge badge-brand">🏢 Yetkili Ofis</span>
        <span className="badge">🛡️ Güvenli İletişim</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <a className="btn btn-primary w-full" href={waLink} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="btn w-full" href={telLink}>Ara</a>
      </div>

      <div className="mt-3 text-xs muted">
        * Numara: ilan içine <b>phone</b> / <b>agentPhone</b> eklersen otomatik kullanır.
      </div>
    </div>
  );
}
`);

w("components/VisitRequestForm.jsx", `import { useMemo } from "react";

export default function VisitRequestForm({ item }) {
  const formName = "visit-request";
  const subject = useMemo(() => {
    return \`Ziyaret Talebi • \${item?.title || "İlan"} • \${item?.id || ""}\`;
  }, [item]);

  return (
    <div className="card p-5 page-text">
      <div className="font-extrabold text-slate-900">Ziyaret talebi</div>
      <p className="mt-2 muted text-sm">
        Bilgilerini bırak; sana geri dönüş yapalım.
      </p>

      {/* Netlify Forms */}
      <form
        name={formName}
        method="POST"
        action="/thanks"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className="mt-4 space-y-3"
      >
        <input type="hidden" name="form-name" value={formName} />
        <input type="hidden" name="subject" value={subject} />
        <input type="hidden" name="listingId" value={String(item?.id || "")} />
        <input type="hidden" name="listingTitle" value={String(item?.title || "")} />

        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-extrabold muted mb-1">Ad Soyad</div>
            <input name="name" required className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85" />
          </div>
          <div>
            <div className="text-xs font-extrabold muted mb-1">Telefon</div>
            <input name="phone" required inputMode="tel" className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85" />
          </div>
        </div>

        <div>
          <div className="text-xs font-extrabold muted mb-1">Mesaj</div>
          <textarea name="message" rows="4" className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
            placeholder="Uygun olduğum zaman aralığı: ..."></textarea>
        </div>

        <button className="btn btn-primary w-full" type="submit">Gönder</button>

        <div className="text-xs muted">
          Gönderince Netlify panelinde “Forms” kısmına düşer.
        </div>
      </form>
    </div>
  );
}
`);

w("components/RelatedListings.jsx", `import PropertyCard from "./PropertyCard";

function num(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function RelatedListings({ item, items = [] }) {
  const basePrice = num(item?.price);
  const baseArea = num(item?.area);

  let rel = (items || [])
    .filter(x => String(x.id) !== String(item.id))
    .filter(x => x.status === "Yayinda")
    .filter(x => x.district === item.district);

  // fiyat bandı ±%12 (fiyat varsa)
  if (basePrice !== null) {
    const lo = basePrice * 0.88;
    const hi = basePrice * 1.12;
    rel = rel.filter(x => {
      const p = num(x.price);
      return p === null ? true : (p >= lo && p <= hi);
    });
  }

  // oda benzerliği (varsa)
  if (item.rooms) {
    rel = rel.filter(x => !x.rooms || x.rooms === item.rooms);
  }

  // m² yakınlık (varsa)
  if (baseArea !== null) {
    rel = rel
      .map(x => ({ x, d: Math.abs((num(x.area) ?? baseArea) - baseArea) }))
      .sort((a,b) => a.d - b.d)
      .map(o => o.x);
  }

  rel = rel.slice(0, 6);

  if (!rel.length) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-extrabold" style={{ color: "#eaf2ef" }}>Benzer ilanlar</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rel.map(x => <PropertyCard key={x.id} item={x} />)}
      </div>
    </div>
  );
}
`);

/* ========= Pages ========= */
w("pages/thanks.jsx", `import Layout from "../components/Layout";

export default function Thanks(){
  return (
    <Layout title="Teşekkürler | MyLifeVilla" desc="Talebin alındı." path="/thanks">
      <div className="card p-8 page-text">
        <div className="text-2xl font-extrabold tracking-tight">Teşekkürler ✅</div>
        <p className="mt-2 muted">Ziyaret talebin alındı. En kısa sürede geri dönüş yapacağız.</p>
        <div className="mt-6 flex gap-2">
          <a className="btn btn-primary" href="/">İlanlara dön</a>
          <a className="btn" href="/favorites">Favoriler</a>
        </div>
      </div>
    </Layout>
  );
}
`);

/* ========= 6) Home pagination: “Daha fazla yükle” ========= */
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

  // Pagination
  const PAGE = 12;
  const [visible, setVisible] = useState(PAGE);

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

  // Filtre değişince sayfalama sıfırlansın
  useEffect(() => {
    if (!hydrated) return;
    setVisible(PAGE);
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

  const shown = useMemo(() => listings.slice(0, visible), [listings, visible]);

  const onReset = () => {
    setQ("");
    setDistrict("ALL");
    setType("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  };

  return (
    <Layout title="MyLifeVilla | Pendik & Tuzla Emlak" desc="Pendik ve Tuzla bölgesinde satılık & kiralık emlak ilanları." path="/">
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

      <div className="mt-4">
        <ListingMap items={listings.slice(0, 30)} />
      </div>

      <section className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm" style={{ color: "rgba(234,242,239,.85)" }}>
            <span className="font-extrabold" style={{ color:"#eaf2ef" }}>{listings.length}</span> ilan bulundu
          </div>
          <div className="flex gap-2">
            <a className="btn" href="/compare">Karşılaştır</a>
            <a className="btn" href="/favorites">Favoriler</a>
          </div>
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
        ) : shown.length === 0 ? (
          <div className="card p-10 muted page-text">Sonuç yok. Filtreleri sıfırla.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map((item) => <PropertyCard key={item.id} item={item} />)}
            </div>

            {visible < listings.length ? (
              <div className="mt-5 flex justify-center">
                <button className="btn btn-primary" onClick={() => setVisible(v => v + PAGE)}>
                  Daha fazla yükle ({Math.min(visible + PAGE, listings.length)}/{listings.length})
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>

      <ScrollToTop />
    </Layout>
  );
}
`);

/* ========= 7) Listing detail: advisor + form + share + related ========= */
w("pages/listing/[id].jsx", `import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import listings from "../../data/listings.json";
import { toAbsUrl } from "../../lib/seo";
import { isFav, toggleFav } from "../../lib/favorites";
import { isCompared, toggleCompare } from "../../lib/compare";
import { isNew } from "../../lib/date";
import AdvisorCard from "../../components/AdvisorCard";
import VisitRequestForm from "../../components/VisitRequestForm";
import ShareButtons from "../../components/ShareButtons";
import RelatedListings from "../../components/RelatedListings";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
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
  const allItems = (listings?.items || []);
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

              <a className="btn btn-primary" href="#visit">Ziyaret talebi</a>
            </div>
          </div>

          <div className="mt-4">
            <ShareButtons title={item.title} />
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

              <div id="visit" className="mt-6">
                <VisitRequestForm item={item} />
              </div>
            </div>

            <div className="space-y-4">
              <AdvisorCard item={item} />

              <div className="card p-5 page-text">
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
                    <a className="btn w-full" href="/compare">Karşılaştır’a git</a>
                    <a className="btn w-full" href="/favorites">Favoriler</a>
                    <a className="btn w-full" href="/">Tüm ilanlara dön</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RelatedListings item={item} items={allItems} />
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

/* ========= CSS small: make section headings readable on green bg ========= */
{
  const cssPath = "styles/globals.css";
  if (exists(cssPath)) {
    let css = read(cssPath);
    if (!css.includes("/* ===== Pack-6 extras ===== */")) {
      css += `

/* ===== Pack-6 extras ===== */
a{ text-decoration: none; }
`;
      fs.writeFileSync(cssPath, css, "utf8");
    }
  }
}

console.log("✅ Pack-6 OK: advisor + related + netlify form + share + pagination.");
console.log("➡️ Sonra: npm run build && npm run export && git add . && git commit -m \"Advisor + related + forms + share + pagination\" && git push");
