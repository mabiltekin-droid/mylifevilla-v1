@echo off
echo Proje olusturuluyor...

mkdir components
mkdir data
mkdir pages
mkdir pages\listing
mkdir public
mkdir public\admin
mkdir public\uploads
mkdir styles

type nul > pages\_app.jsx
type nul > pages\index.jsx
type nul > pages\listing\[id].jsx

type nul > components\Layout.jsx
type nul > components\Navbar.jsx
type nul > components\FilterBar.jsx
type nul > components\PropertyCard.jsx

type nul > styles\globals.css
type nul > data\listings.json

type nul > public\admin\index.html
type nul > public\admin\config.yml

type nul > next.config.js
type nul > netlify.toml
type nul > README.md

echo.
echo Her sey hazir ✅
pause
