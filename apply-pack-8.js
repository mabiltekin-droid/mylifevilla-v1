const fs = require("fs");

const p = "styles/globals.css";
let css = fs.readFileSync(p, "utf8");

const goldBar = `
/* ===== Gold Top Bar ===== */
.lux-topbar{
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent,
    #c7a14a 20%,
    #e7c873 50%,
    #c7a14a 80%,
    transparent
  );
}
`;

if (css.includes(".lux-topbar")) {
  css = css.replace(/\.lux-topbar\s*\{[\s\S]*?\}/m, goldBar);
} else {
  css += goldBar;
}

fs.writeFileSync(p, css);

console.log("✅ Gold header bar applied");
