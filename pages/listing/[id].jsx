import { useMemo, useState } from "react";
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

function Lightbox({ open, src, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button className="btn bg-white" onClick={onClose}>Kapat ✕</button>
        </div>
        <div className="card overflow-hidden">
          <img src={src} alt="Foto" className="w-full h-[70vh] object-contain bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function Detail({ item }) {
  const images = useMemo(() => (item?.images || []).filter(Boolean), [item]);
  const [active, setActive] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  if (!item) return null;

  const badge =
    item.type === "Satilik"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-sky-100 text-sky-800";

  const cover = images[active] || images[0] || null;

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <a className="btn" href="/">← Geri</a>
        <a className="btn btn-primary" href="/admin/">Admin</a>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="relative aspect-[21/11] bg-slate-100">
              {cover ? (
                <button
                  className="w-full h-full"
                  style={{ display: "block" }}
                  onClick={() => setLbOpen(true)}
                  title="Büyüt"
                >
                  <img src={cover} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  Fotoğraf yok
                </div>
              )}

              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`badge ${badge}`}>{item.type === "Satilik" ? "Satılık" : "Kiralık"}</span>
                {item.featured ? <span className="badge bg-amber-100 text-amber-800">Öne Çıkan</span> : null}
              </div>
            </div>

            {images.length > 1 ? (
              <div className="p-3 border-t hairline bg-white/70">
                <div className="flex gap-2 overflow-auto">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActive(i)}
                      className={`h-16 w-24 rounded-xl overflow-hidden border ${i === active ? "border-slate-400" : "border-slate-200"}`}
                      title={`Foto ${i + 1}`}
                    >
                      <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="card p-6 mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-slate-100 text-slate-800">{item.district}</span>
              {item.neighborhood ? <span className="badge bg-slate-100 text-slate-800">{item.neighborhood}</span> : null}
              {item.heating ? <span className="badge bg-slate-100 text-slate-800">{item.heating}</span> : null}
            </div>

            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              {item.title}
            </h1>

            <div className="mt-2 muted">
              {item.city} / {item.district}{item.neighborhood ? ` • ${item.neighborhood}` : ""}
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
            <h3 className="text-lg font-extrabold">Özet</h3>
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

          <div className="card p-6 mt-4 text-sm muted">
            Fotoğraf eklemek için Admin → İlanlar → Görseller alanını kullan.
          </div>
        </aside>
      </section>

      <Lightbox open={lbOpen} src={cover || ""} onClose={() => setLbOpen(false)} />
    </Layout>
  );
}
