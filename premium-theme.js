const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };

/* ========= globals.css: gerçek premium ========= */
w("styles/globals.css", `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== Base ===== */
:root{
  --brand:#0f3d2e;
  --brand2:#145c43;
  --gold:#c7a14a;
  --gold2:#e7c873;
}

body{
  background: radial-gradient(1200px 500px at 50% -200px, rgba(15,61,46,.18), transparent 60%),
              linear-gradient(180deg, #fbfbfa 0%, #f5f6f7 100%);
  color:#0f172a;
}

.container-max{
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

.hairline{ border-color: rgba(15,23,42,.10); }

.muted{ color: rgba(15,23,42,.65); }

/* ===== Cards ===== */
.card{
  @apply rounded-3xl border bg-white/85 backdrop-blur;
  border-color: rgba(15,23,42,.10);
  box-shadow:
    0 1px 0 rgba(255,255,255,.6) inset,
    0 10px 30px rgba(2,6,23,.06);
}

.card-hover{
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card-hover:hover{
  transform: translateY(-2px);
  border-color: rgba(199,161,74,.28);
  box-shadow:
    0 1px 0 rgba(255,255,255,.7) inset,
    0 18px 46px rgba(2,6,23,.12);
}

/* ===== Buttons ===== */
.btn{
  @apply inline-flex items-center justify-center rounded-full px-4 py-2 font-extrabold;
  border: 1px solid rgba(15,23,42,.12);
  background: rgba(255,255,255,.85);
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}
.btn:hover{
  background: rgba(255,255,255,.95);
  border-color: rgba(15,23,42,.18);
}
.btn:active{ transform: translateY(1px); }

.btn-primary{
  border-color: rgba(15,61,46,.15);
  background: linear-gradient(180deg, var(--brand) 0%, #0c2f24 100%);
  color: white;
  box-shadow: 0 10px 24px rgba(15,61,46,.20);
}
.btn-primary:hover{
  background: linear-gradient(180deg, var(--brand2) 0%, var(--brand) 100%);
  border-color: rgba(199,161,74,.25);
}

/* ===== Badges ===== */
.badge{
  @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.8);
}
.badge-brand{
  border-color: rgba(15,61,46,.18);
  background: rgba(15,61,46,.10);
  color: var(--brand);
}
.badge-gold{
  border-color: rgba(199,161,74,.25);
  background: rgba(199,161,74,.14);
  color: #7a5a12;
}

/* ===== Header line (luxury) ===== */
.lux-topbar{
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
`);

/* ========= PropertyCard: premium görünüm + placeholder ========= */
w("components/PropertyCard.jsx", `import Link from "next/link";

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

export default function PropertyCard({ item }) {
  const img = (item.images || []).find(Boolean);

  return (
    <Link href={\`/listing/\${item.id}\`} className="block">
      <div className="card card-hover overflow-hidden">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <span className={\`badge \${item.type === "Satilik" ? "badge-brand" : ""}\`}>
              {item.type === "Satilik" ? "Satılık" : "Kiralık"}
            </span>
            {item.featured ? <span className="badge badge-gold">Öne Çıkan</span> : null}
          </div>

          {img ? (
            <img
              src={img}
              alt={item.title}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-48 w-full bg-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl">🏡</div>
                <div className="mt-1 text-sm muted">Fotoğraf eklenecek</div>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
               style={{background:"linear-gradient(180deg, transparent, rgba(0,0,0,.10))"}} />
        </div>

        <div className="p-5">
          <div className="font-extrabold tracking-tight text-slate-900 line-clamp-2">
            {item.title}
          </div>
          <div className="mt-1 text-sm muted">
            {item.city} / {item.district}{item.neighborhood ? \` • \${item.neighborhood}\` : ""}
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="text-xl font-extrabold text-slate-900">
              {formatTRY(item.price)} ₺
            </div>
            <div className="text-xs muted whitespace-nowrap">
              {item.area ? <span className="font-bold text-slate-700">{item.area}</span> : null} m²
              {item.rooms ? <span> • <span className="font-bold text-slate-700">{item.rooms}</span></span> : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
`);

/* ========= Navbar: üstte altın çizgi + logo hizalama ========= */
w("components/Navbar.jsx", `export default function Navbar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="lux-topbar" />
      <div className="border-b hairline bg-white/70 backdrop-blur">
        <div className="container-max h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="MyLifeVilla"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          <a className="btn btn-primary" href="/">
            İlanlar
          </a>
        </div>
      </div>
    </header>
  );
}
`);

console.log("✅ Premium tema uygulandı (luxury header, premium cards, premium buttons).");
