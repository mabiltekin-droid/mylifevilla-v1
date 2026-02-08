
import Layout from "../../components/Layout";
import data from "../../data/listings.json";

function formatTRY(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export async function getStaticPaths() {
  const paths = (data.items || [])
    .filter(x => x.status === "Yayinda")
    .map(x => ({ params: { id: x.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const item = (data.items || []).find(x => x.id === params.id) || null;
  return { props: { item } };
}

export default function Detail({ item }) {
  if (!item) return null;

  const img = item?.images?.[0];

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <a className="btn" href="/">← Geri</a>
        <a className="btn" href="/admin/">Admin</a>
      </div>

      <section className="card overflow-hidden">
        <div className="aspect-[21/9] bg-slate-100">
          {img ? (
            <img src={img} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Kapak fotoğrafı yok
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${badge}`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
            {item.featured ? <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span> : null}
            <span className="badge bg-slate-100 text-slate-800">{item.district}</span>
          </div>

          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
            {item.title}
          </h1>

          <div className="mt-2 text-slate-600">
            {item.city} / {item.district}{item.neighborhood ? ` • ${item.neighborhood}` : ""}
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="text-2xl font-extrabold">
              {formatTRY(item.price)} ₺
              {item.type === "Kiralik" ? <span className="text-base font-semibold text-slate-500"> /ay</span> : null}
            </div>

            <div className="text-sm text-slate-600">
              <span className="font-semibold">{item.area}</span> m² •{" "}
              <span className="font-semibold">{item.rooms}</span>
              {item.floor ? <> • Kat: <span className="font-semibold">{item.floor}</span></> : null}
              {Number.isFinite(item.age) ? <> • Yaş: <span className="font-semibold">{item.age}</span></> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-extrabold">Açıklama</h2>
            <p className="mt-2 whitespace-pre-line text-slate-700">
              {item.description}
            </p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-extrabold">Özet</h3>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li><span className="font-semibold">İlçe:</span> {item.district}</li>
              {item.neighborhood ? <li><span className="font-semibold">Mahalle:</span> {item.neighborhood}</li> : null}
              <li><span className="font-semibold">m²:</span> {item.area}</li>
              <li><span className="font-semibold">Oda:</span> {item.rooms}</li>
              {item.heating ? <li><span className="font-semibold">Isınma:</span> {item.heating}</li> : null}
            </ul>
          </div>

          <div className="card p-6 mt-4 text-sm text-slate-600">
            Admin panelden ilan ekleyince otomatik burada görünür.
          </div>
        </aside>
      </section>
    </Layout>
  );
}
