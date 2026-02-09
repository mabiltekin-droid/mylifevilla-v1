const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");

console.log("▶ apply-pack-4 running...");

const cssPath = "styles/globals.css";
if (!exists(cssPath)) {
  console.log("❌ styles/globals.css bulunamadı");
  process.exit(1);
}

let css = read(cssPath);

// Bu blok daha önce eklendiyse tekrar eklemeyelim
if (!css.includes("/* ===== Color Fix Pack ===== */")) {
  css += `

/* ===== Color Fix Pack ===== */
/* Yeşil arka planda genel yazılar açık kalsın */
main{
  color:#eaf2ef;
}

/* Kartların içi her zaman koyu yazı (okunabilirlik) */
.card{
  color:#0f172a;
}

/* Kart içindeki muted'lar tekrar koyu tema muted */
.card .muted{
  color: rgba(15,23,42,.65);
}

/* Kart içindeki başlıklar */
.card h1, .card h2, .card h3, .card h4,
.card .page-text,
.card .text-slate-900,
.card .text-slate-800,
.card .text-slate-700{
  color:#0f172a !important;
}

/* Badge içi yazılar (bazı yerlerde soluk görünmesin) */
.badge{
  color:#0f172a;
}
.badge-brand{
  color: var(--brand);
}
.badge-gold{
  color:#7a5a12;
}

/* Navbar butonları yeşil fonda görünür kalsın */
header .btn{
  color:#0f172a;
}
header .btn-primary{
  color:#ffffff;
}

/* "Vitrin" gibi kart dışı başlıklar açık kalsın */
section > h2, section > h3, .section-title{
  color:#eaf2ef;
}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("✅ Color Fix Pack eklendi.");
} else {
  console.log("ℹ️ Color Fix Pack zaten var, değişiklik yapılmadı.");
}

console.log("➡️ Sonra: npm run build && npm run export && git add . && git commit -m \"Fix text colors\" && git push");
