const fs = require("fs");
const path = require("path");
const w = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, "utf8"); };

console.log("▶ apply-admin-fix-vercel running...");

/**
 * 1) /admin sayfası (Next.js route)
 * Decap CMS scriptini burada yüklüyoruz.
 */
w("pages/admin/index.jsx", `import Head from "next/head";

export default function AdminPage(){
  return (
    <>
      <Head>
        <title>MyLifeVilla Admin</title>
        <meta name="robots" content="noindex,nofollow" />
        <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
      </Head>

      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        Admin yükleniyor...
        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 13 }}>
          Eğer boş kalırsa config yolu: <code>/admin/config.yml</code>
        </div>
      </div>
    </>
  );
}
`);

/**
 * 2) Config dosyası (Decap CMS bunu /admin/config.yml’den okur)
 * Repo + branch doğru.
 *
 * NOT: GitHub ile giriş/commit için OAuth provider gerekir.
 * Şimdilik panelin açılması + config’in görülmesi hedef.
 */
w("public/admin/config.yml", `backend:
  name: github
  repo: mabiltekin-droid/mylifevilla-v1
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "listings"
    label: "İlanlar"
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

console.log("✅ Admin route fixed. Test URLs after deploy:");
console.log("   - /admin");
console.log("   - /admin/config.yml");
console.log('➡️ Then: git add . && git commit -m "Fix admin for Vercel" && git push');
