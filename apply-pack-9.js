const fs = require("fs");

const p = "components/Navbar.jsx";
let code = fs.readFileSync(p, "utf8");

code = code.replace(
  'border-b hairline bg-white/70 backdrop-blur',
  'border-b hairline lux-navbar'
);

fs.writeFileSync(p, code);

const cssPath = "styles/globals.css";
let css = fs.readFileSync(cssPath, "utf8");

if (!css.includes("lux-navbar")) {
  css += `

/* ===== Gold Navbar Background ===== */
.lux-navbar{
  background: linear-gradient(
    90deg,
    #c7a14a 0%,
    #e7c873 40%,
    #f2d98a 60%,
    #c7a14a 100%
  );
  box-shadow: 0 2px 10px rgba(0,0,0,.12);
}
`;
}

fs.writeFileSync(cssPath, css);

console.log("✅ Gold navbar applied");
