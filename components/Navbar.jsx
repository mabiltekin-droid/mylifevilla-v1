export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-white/60 backdrop-blur">
      <div className="container-max h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border hairline bg-white">
            🏠
          </span>
          <span>MyLifeVilla</span>
        </a>

        <div className="flex items-center gap-2">
          <a className="btn" href="/">İlanlar</a>
          <a className="btn btn-primary" href="/admin/">Admin</a>
        </div>
      </div>
    </header>
  );
}
