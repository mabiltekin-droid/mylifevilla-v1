const fs = require("fs");

function w(p, c) {
  fs.writeFileSync(p, c, "utf8");
}

/* ================= INDEX (ilan listesi + filtre) ================= */
w("pages/index.jsx", `
import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import data from "../data/listings.json";

export default function Home() {
  const [district, setDistrict] = useState("ALL");
  const [type, setType] = useState("ALL");

  const listings = useMemo(() => {
    return data.items.filter(x =>
      x.status === "Yayinda" &&
      (district === "ALL" || x.district === district) &&
      (type === "ALL" || x.type === type)
    );
  }, [district, type]);

  return (
    <Layout>
      <h1 className="text-2xl font-extrabold mb-4">İlanlar</h1>

      <div className="flex gap-3 mb-6">
        <select onChange={e=>setDistrict(e.target.value)} className="btn">
          <option value="ALL">Pendik + Tuzla</option>
          <option>Pendik</option>
          <option>Tuzla</option>
        </select>

        <select onChange={e=>setType(e.target.value)} className="btn">
          <option value="ALL">Hepsi</option>
          <option>Satilik</option>
          <option>Kiralik</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map(x => (
          <a key={x.id} href={"/listing/"+x.id} className="card p-4 hover:shadow-md">
            <h3 className="font-bold">{x.title}</h3>
            <p className="text-sm text-gray-500">{x.district}</p>
            <p className="mt-2 font-extrabold">{x.price} ₺</p>
          </a>
        ))}
      </div>
    </Layout>
  );
}
`);


/* ================= DETAIL ================= */
w("pages/listing/[id].jsx", `
import Layout from "../../components/Layout";
import data from "../../data/listings.json";

export async function getStaticPaths(){
  return {
    paths: data.items.map(x => ({ params:{ id:x.id } })),
    fallback:false
  }
}

export async function getStaticProps({params}){
  const item = data.items.find(x=>x.id===params.id);
  return { props:{item} }
}

export default function Detail({item}){
  return (
    <Layout>
      <a href="/" className="btn mb-4">← Geri</a>

      <div className="card p-6">
        <h1 className="text-2xl font-extrabold">{item.title}</h1>
        <p className="text-gray-500">{item.district}</p>

        <p className="mt-4 font-bold text-xl">{item.price} ₺</p>

        <p className="mt-4">{item.description}</p>
      </div>
    </Layout>
  )
}
`);

console.log("FULL Emlak sistemi yazildi ✅");
