const fs = require("fs");

const p = "styles/globals.css";
let css = fs.readFileSync(p, "utf8");

if (!css.includes("/* ===== Button Color Fix ===== */")) {
  css += `

/* ===== Button Color Fix ===== */

/* Karşılaştır / Favoriler / normal butonlar koyu yazı */
.btn{
  color:#0f172a;
}

/* ScrollToTop özel */
.scroll-top-btn{
  color:#0f172a !important;
}

/* Primary zaten beyaz kalsın */
.btn-primary{
  color:#ffffff !important;
}
`;
  fs.writeFileSync(p, css);
  console.log("✅ Button color fix applied");
} else {
  console.log("ℹ️ Already applied");
}
