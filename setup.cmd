@echo off
setlocal EnableExtensions

REM === Safety: must run inside project folder ===
echo [1/7] Klasor kontrol...
cd >nul 2>&1
echo Bulundugun dizin: %CD%
echo.

echo [2/7] Klasorler olusturuluyor...
mkdir components 2>nul
mkdir data 2>nul
mkdir pages 2>nul
mkdir pages\listing 2>nul
mkdir public 2>nul
mkdir public\admin 2>nul
mkdir public\uploads 2>nul
mkdir styles 2>nul

REM keep uploads in git
if not exist public\uploads\.gitkeep type nul > public\uploads\.gitkeep

echo [3/7] package.json yaziliyor...
(
echo {
echo   "name": "mylifevilla-repo",
echo   "private": true,
echo   "version": "1.0.0",
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build ^&^& next export"
echo   },
echo   "dependencies": {
echo     "next": "14.2.5",
echo     "react": "18.3.1",
echo     "react-dom": "18.3.1"
echo   },
echo   "devDependencies": {
echo     "tailwindcss": "3.4.10",
echo     "postcss": "8.4.41",
echo     "autoprefixer": "10.4.20"
echo   }
echo }
) > package.json

echo [4/7] Konfig dosyalari yaziliyor...
(
echo /** @type {import^("next"^).NextConfig} */
echo const nextConfig = {
echo   output: "export",
echo   images: { unoptimized: true }
echo };
echo.
echo module.exports = nextConfig;
) > next.config.js

(
echo [build]
echo   command = "npm run build"
echo   publish = "out"
echo.
echo [[redirects]]
echo   from = "/admin/*"
echo   to = "/admin/index.html"
echo   status = 200
) > netlify.toml

(
echo module.exports = {
echo   content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
echo   theme: { extend: {} },
echo   plugins: [],
echo };
) > tailwind.config.js

(
echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {}
echo   }
echo };
) > postcss.config.js

echo [5/7] Stil ve veri dosyalari yaziliyor...
(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo :root { color-scheme: light; }
echo body { background: #f8fafc; color: #0f172a; }
echo.
echo .container-max { max-width: 72rem; margin: 0 auto; padding: 0 1rem; }
echo .card { background: white; border: 1px solid #e2e8f0; border-radius: 1rem; box-shadow: 0 1px 2px rgba^(15,23,42,0.06^); }
echo .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.75rem; padding: 0.5rem 1rem; font-weight: 700; border: 1px solid #e2e8f0; background: white; }
echo .btn:hover { background: #f1f5f9; }
echo .badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 0.25rem 0.75rem; font-size: 0.875rem; font-weight: 700; }
) > styles\globals.css

(
echo { 
echo   "items": [
echo     {
echo       "id": "pendik-orhangazi-3-1-001",
echo       "title": "Pendik Orhangazi'de 3+1 Ferah Daire",
echo       "price": 4250000,
echo       "type": "Satilik",
echo       "city": "Istanbul",
echo       "district": "Pendik",
echo       "neighborhood": "Orhangazi",
echo       "area": 125,
echo       "rooms": "3+1",
echo       "age": 8,
echo       "floor": "3",
echo       "heating": "Kombi",
echo       "description": "Marmaray'a yakin, aydinlik, masrafsiz.",
echo       "images": [],
echo       "featured": true,
echo       "status": "Yayinda"
echo     },
echo     {
echo       "id": "tuzla-aydinli-2-1-002",
echo       "title": "Tuzla Aydinli'da 2+1 Site Ici",
echo       "price": 22000,
echo       "type": "Kiralik",
echo       "city": "Istanbul",
echo       "district": "Tuzla",
echo       "neighborhood": "Aydinli",
echo       "area": 90,
echo       "rooms": "2+1",
echo       "age": 5,
echo       "floor": "5",
echo       "heating": "Merkezi",
echo       "description": "Site ici guvenlik, otopark, cocuk parki.",
echo       "images": [],
echo       "featured": false,
echo       "status": "Yayinda"
echo     }
echo   ]
echo }
) > data\listings.json

echo [6/7] Admin dosyalari yaziliyor...
(
echo ^<!doctype html^>
echo ^<html^>
echo   ^<head^>
echo     ^<meta charset="utf-8" /^>
echo     ^<meta name="viewport" content="width=device-width,initial-scale=1" /^>
echo     ^<title^>Admin ^| MyLifeVilla^</title^>
echo   ^</head^>
echo   ^<body^>
echo     ^<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"^>^</script^>
echo     ^<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"^>^</script^>
echo     ^<script^>
echo       if ^(window.netlifyIdentity^) ^{
echo         window.netlifyIdentity.on^("init", function^(user^) ^{
echo           if ^(!user^) ^{
echo             window.netlifyIdentity.on^("login", function^(^) ^{
echo               document.location.href = "/admin/";
echo             }^);
echo           }
echo         }^);
echo       }
echo     ^</script^>
echo   ^</body^>
echo ^</html^>
) > public\admin\index.html

(
echo backend:
echo   name: git-gateway
echo   branch: main
echo.
echo media_folder: "public/uploads"
echo public_folder: "/uploads"
echo.
echo publish_mode: simple
echo.
echo collections:
echo   - name: "listings"
echo     label: "Ilanlar"
echo     format: "json"
echo     extension: "json"
echo     files:
echo       - file: "data/listings.json"
echo         label: "Ilan Listesi"
echo         name: "listings"
echo         fields:
echo           - label: "Ilanlar"
echo             name: "items"
echo             widget: "list"
echo             summary: "{{fields.title}} - {{fields.district}}"
echo             fields:
echo               - { label: "ID", name: "id", widget: "string" }
echo               - { label: "Baslik", name: "title", widget: "string" }
echo               - { label: "Fiyat", name: "price", widget: "number", value_type: "int", min: 0 }
echo               - { label: "Tur", name: "type", widget: "select", options: ["Satilik", "Kiralik"] }
echo               - { label: "Sehir", name: "city", widget: "string", default: "Istanbul" }
echo               - { label: "Ilce", name: "district", widget: "select", options: ["Pendik", "Tuzla"] }
echo               - { label: "Mahalle", name: "neighborhood", widget: "string", required: false }
echo               - { label: "m2", name: "area", widget: "number", value_type: "int", min: 0 }
echo               - { label: "Oda", name: "rooms", widget: "string" }
echo               - { label: "Bina Yasi", name: "age", widget: "number", value_type: "int", min: 0, required: false }
echo               - { label: "Kat", name: "floor", widget: "string", required: false }
echo               - { label: "Isinma", name: "heating", widget: "string", required: false }
echo               - { label: "Aciklama", name: "description", widget: "text" }
echo               - label: "Gorseller"
echo                 name: "images"
echo                 widget: "list"
echo                 field: { label: "Gorsel", name: "image", widget: "image" }
echo               - { label: "One Cikar", name: "featured", widget: "boolean", default: false }
echo               - { label: "Durum", name: "status", widget: "select", options: ["Yayinda", "Taslak"], default: "Yayinda" }
) > public\admin\config.yml



echo ✅ Dosyalar hazir. Simdi kurulum:
echo    npm install
echo    npm run dev
echo.
pause
endlocal
