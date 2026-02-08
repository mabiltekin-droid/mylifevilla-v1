
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

  const featuredCount = useMemo(() => (data.items || []).filter(x => x.status === "Yayinda" && x.featured).length, []);

  return (
    <Layout>
      <section className="card p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 badge bg-slate-100 text-slate-800">
              Pendik • Tuzla
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Premium Emlak İlanları
            </h1>
            <p className="mt-2 text-slate-600">
              Admin’den ekle → <span className="font-semibold">/admin</span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="card px-4 py-3">
              <div className="text-xs font-bold text-slate-500">Yayındaki ilan</div>
              <div className="text-xl font-extrabold">{(data.items || []).filter(x => x.status === "Yayinda").length}</div>
            </div>
            <div className="card px-4 py-3">
              <div className="text-xs font-bold text-slate-500">Öne çıkan</div>
              <div className="text-xl font-extrabold">{featuredCount}</div>
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
          <div className="text-sm text-slate-600">
            <span className="font-semibold">{listings.length}</span> ilan bulundu
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="card p-10 text-slate-600">Sonuç yok. Filtreleri sıfırla.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(item => <PropertyCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
