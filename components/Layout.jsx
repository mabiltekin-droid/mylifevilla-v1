import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-max py-6">{children}</main>

      <footer className="mt-10 border-t hairline bg-white/60 backdrop-blur">
        <div className="container-max py-7 text-sm muted flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} MyLifeVilla — Pendik ve Tuzla Emlak</div>
          <div className="flex gap-3">
            <a className="hover:underline" href="/admin/">Yönetim</a>
            <a className="hover:underline" href="/">İlanlar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
