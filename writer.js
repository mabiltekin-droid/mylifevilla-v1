const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

write("pages/_app.jsx", `import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
`);

write("components/Navbar.jsx", `export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-max h-16 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight text-lg">MyLifeVilla</a>
        <div className="flex items-center gap-3">
          <a className="btn" href="/admin/">Admin</a>
        </div>
      </div>
    </header>
  );
}
`);

write("components/Layout.jsx", `import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-max py-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-max py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} MyLifeVilla — Pendik ve Tuzla Emlak
        </div>
      </footer>
    </div>
  );
}
`);

write("components/FilterBar.jsx", `export default function FilterBar(){ return null; }
`);

write("components/PropertyCard.jsx", `export default function PropertyCard(){ return null; }
`);

write("pages/index.jsx", `import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="card p-6">
        <h1 className="text-2xl font-extrabold">MyLifeVilla Hazır</h1>
        <p className="mt-2 text-slate-600">
          Admin panel: <span className="font-semibold">/admin</span>
        </p>
      </section>
    </Layout>
  );
}
`);

write("pages/listing/[id].jsx", `import Layout from "../../components/Layout";

export default function Listing() {
  return (
    <Layout>
      <div className="card p-6">Detay sayfası (sonra dolduracağız)</div>
    </Layout>
  );
}
`);

console.log("React dosyalari yazildi ✅");
