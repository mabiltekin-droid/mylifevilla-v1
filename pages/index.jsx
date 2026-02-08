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
