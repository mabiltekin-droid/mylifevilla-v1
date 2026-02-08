export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-white/60 backdrop-blur">
      <div className="container-max h-16 flex items-center justify-between">

        {/* LOGO */}
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="MyLifeVilla"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </a>

        {/* Menü */}
        <a className="btn" href="/">
          İlanlar
        </a>

      </div>
    </header>
  );
}
