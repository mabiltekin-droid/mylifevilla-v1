export default function Navbar() {
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
