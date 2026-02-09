import { useEffect, useMemo, useState } from "react";
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
        const hay = normalize(`${x.title} ${x.neighborhood || ""} ${x.rooms || ""} ${x.district}`);
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
