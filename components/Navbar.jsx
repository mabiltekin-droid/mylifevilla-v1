export default function Navbar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="lux-topbar" />
      <div className="border-b hairline lux-navbar">
        <div className="container-max h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="MyLifeVilla"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-2">
            <a className="btn" href="/favorites">Favoriler</a>
            <a className="btn btn-primary" href="/">İlanlar</a>
          </div>
        </div>
      </div>
    </header>
  );
}
