import { useEffect, useMemo, useState } from "react";
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
                ["Fiyat", (it) => `${formatTRY(it.price)} ₺`],
                ["İlçe", (it) => `${it.city} / ${it.district}`],
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
