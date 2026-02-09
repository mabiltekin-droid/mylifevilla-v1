const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };

console.log("▶ apply-pack-admin-vercel running...");

/**
 * 1) /admin route: Next.js sayfası -> /admin/index.html’e yönlendirir
 *    Böylece mysite.com/admin çalışır
 */
w("pages/admin.jsx", `import { useEffect } from "react";

export default function AdminRedirect(){
  useEffect(() => {
    // /admin -> /admin/index.html
    window.location.replace("/admin/index.html");
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      Admin açılıyor...
    </div>
  );
}
`);

/**
 * 2) Decap CMS (Netlify CMS) statik admin dosyaları
 *    - public/admin/index.html
 *    - public/admin/config.yml
 *
 * Not: GitHub backend kullanıyorsan OAuth gerekir. Aşağıya minimum config koydum.
 *      Şimdilik en azından admin ekranı açılacak (404 gitmiş olacak).
 */
w("public/admin/index.html", `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>MyLifeVilla Admin</title>

    <!-- Decap CMS -->
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>

    <style>
      body{ margin:0; font-family:system-ui; }
    </style>
  </head>
  <body>
  </body>
</html>
`);

/**
 * config.yml:
 * - Repo’yu kendi GitHub repo’n olarak ayarladım.
 * - İçerik yolu örnek olarak data/listings.json’ı yönetmek için ayarlı.
 * - İstersen collections’ı genişletiriz.
 *
 * ÖNEMLİ: GitHub backend için OAuth gerekir. (Aşağıda anlatıyorum)
 */
w("public/admin/config.yml", `site_url: https://YOUR_VERCEL_DOMAIN_HERE
display_url: https://YOUR_VERCEL_DOMAIN_HERE

backend:
  name: github
  repo: mabiltekin-droid/mylifevilla-v1
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

# Yerelde login/commit olmadan denemek istersen:
# local_backend: true

collections:
  - name: "listings"
    label: "İlanlar (JSON)"
    files:
      - file: "data/listings.json"
        label: "İlan Listesi"
        name: "listings_json"
        fields:
          - label: "Items"
            name: "items"
            widget: "list"
            fields:
              - { label: "ID", name: "id", widget: "string" }
              - { label: "Başlık", name: "title", widget: "string" }
              - { label: "Şehir", name: "city", widget: "string", default: "İstanbul" }
              - { label: "İlçe", name: "district", widget: "string" }
              - { label: "Mahalle", name: "neighborhood", widget: "string", required: false }
              - { label: "Tip (Satilik/Kiralik)", name: "type", widget: "string" }
              - { label: "Fiyat", name: "price", widget: "number" }
              - { label: "m²", name: "area", widget: "number", required: false }
              - { label: "Oda", name: "rooms", widget: "string", required: false }
              - { label: "Öne çıkan", name: "featured", widget: "boolean", default: false }
              - { label: "Durum (Yayinda/Taslak)", name: "status", widget: "string", default: "Yayinda" }
              - { label: "CreatedAt (YYYY-MM-DD)", name: "createdAt", widget: "string", required: false }
              - label: "Görseller"
                name: "images"
                widget: "list"
                required: false
                field: { label: "URL", name: "url", widget: "string" }
              - { label: "Telefon", name: "phone", widget: "string", required: false }
              - { label: "Lat", name: "lat", widget: "number", required: false }
              - { label: "Lng", name: "lng", widget: "number", required: false }
`);

console.log("✅ Admin fix applied: /admin now redirects to /admin/index.html");
console.log('➡️ Sonra: git add . && git commit -m "Fix admin route for Vercel" && git push');
