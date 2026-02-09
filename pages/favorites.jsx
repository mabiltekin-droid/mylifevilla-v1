import { useEffect, useMemo, useState } from "react";
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
