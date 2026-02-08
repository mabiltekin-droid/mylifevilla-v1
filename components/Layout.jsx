import Navbar from "./Navbar";

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
