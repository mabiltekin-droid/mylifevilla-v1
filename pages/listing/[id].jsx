import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import listings from "../../data/listings.json";
import { toAbsUrl } from "../../lib/seo";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

function normalizePhone(p){
  const s = String(p || "").replace(/[^0-9]/g, "");
  // 90 ile başlamıyorsa TR varsay (çok kaba ama iş görür)
  if (!s) return "";
  if (s.startsWith("90")) return s;
  if (s.startsWith("0")) return "9" + s; // 0xxxxxxxxxx -> 90xxxxxxxxxx
  return "90" + s;
}

export async function getStaticPaths() {
  const items = (listings?.items || []);
  const paths = items.map((item) => ({
    params: { id: String(item.id) },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const id = String(params?.id ?? "");
  const item = (listings?.items || []).find((x) => String(x.id) === id);
  if (!item) return { notFound: true };
  return { props: { item } };
}

export default function ListingDetail({ item }) {
  const images = useMemo(() => (item?.images || []).filter(Boolean), [item]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

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
  const title = `${item.title} | MyLifeVilla`;
  const desc = `${item.city} / ${item.district}${item.neighborhood ? " - " + item.neighborhood : ""} • ${formatTRY(item.price)} ₺ • ${item.area || ""} m²`.trim();

  // WhatsApp
  const rawPhone = item.phone || item.contactPhone || item.whatsapp || "";
  const phone = normalizePhone(rawPhone) || "905000000000"; // <- burayı kendi numaranla değiştir
  const waText = encodeURIComponent(`Merhaba, "${item.title}" ilanı hakkında bilgi almak istiyorum.\n\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const waLink = `https://wa.me/${phone}?text=${waText}`;

  return (
    <Layout
      title={title}
      desc={desc}
      image={toAbsUrl(cover)}
      path={`/listing/${item.id}`}
    >
      <div className="card overflow-hidden">
        <div className="p-6 border-b hairline">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                {item.title}
              </h1>
              <div className="mt-2 muted">
                {item.city} / {item.district}{item.neighborhood ? ` • ${item.neighborhood}` : ""}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`badge ${item.type === "Satilik" ? "badge-brand" : ""}`}>
                  {item.type === "Satilik" ? "Satılık" : "Kiralık"}
                </span>
                {item.featured ? <span className="badge badge-gold">Öne Çıkan</span> : null}
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

              <a className="btn btn-primary" href={waLink} target="_blank" rel="noreferrer">
                WhatsApp ile iletişim
              </a>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(images.length ? images : [null, null, null]).slice(0, 6).map((src, i) => (
              <button
                key={i}
                className="overflow-hidden rounded-2xl border hairline bg-white/70"
                onClick={() => { if(!src) return; setIdx(i); setOpen(true); }}
                style={{ aspectRatio: "16/10" }}
              >
                {src ? (
                  <img src={src} alt={item.title} className="w-full h-full object-cover" loading="lazy" width="1200" height="750" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <div className="text-center">
                      <div className="text-2xl">🖼️</div>
                      <div className="mt-1 text-sm muted">Fotoğraf eklenecek</div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="font-extrabold text-slate-900">Açıklama</div>
              <p className="mt-2 muted whitespace-pre-line">
                {item.description || "Açıklama eklenecek."}
              </p>
            </div>

            <div className="card p-5">
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
                  <a className="btn btn-primary w-full" href={waLink} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                  <a className="btn w-full" href="/">
                    Tüm ilanlara dön
                  </a>
                </div>

                <div className="pt-2 text-xs muted">
                  * WhatsApp numarası için listings.json'a <span className="font-bold">phone</span> alanı ekleyebilirsin.
                </div>
              </div>
            </div>
          </div>
        </div>

        {open ? (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-3">
                <button className="btn" onClick={() => setOpen(false)}>Kapat</button>
              </div>
              <div className="overflow-hidden rounded-3xl border hairline bg-black">
                <img
                  src={images[idx]}
                  alt={item.title}
                  className="w-full max-h-[75vh] object-contain bg-black"
                />
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
