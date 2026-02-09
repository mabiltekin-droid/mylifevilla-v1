function normalizePhone(p){
  const s = String(p || "").replace(/[^0-9]/g, "");
  if (!s) return "";
  if (s.startsWith("90")) return s;
  if (s.startsWith("0")) return "9" + s;
  return "90" + s;
}

export default function AdvisorCard({ item }) {
  // İlanda varsa kullan; yoksa default
  const name = item?.agentName || item?.advisorName || "MyLifeVilla Danışmanı";
  const role = item?.agentRole || "Gayrimenkul Danışmanı";
  const photo = item?.agentPhoto || "/logo.png";
  const office = item?.agentOffice || "MyLifeVilla • Pendik & Tuzla";
  const rawPhone = item?.phone || item?.contactPhone || item?.whatsapp || item?.agentPhone || "";
  const phone = normalizePhone(rawPhone) || "905000000000"; // <- kendi numaranı yazabilirsin

  const waText = encodeURIComponent(`Merhaba! "${item?.title || "ilan"}" için bilgi alabilir miyim?\nLink: ${typeof window !== "undefined" ? window.location.href : ""}`);
  const waLink = `https://wa.me/${phone}?text=${waText}`;
  const telLink = `tel:+${phone}`;

  return (
    <div className="card p-5 page-text">
      <div className="flex items-center gap-3">
        <img src={photo} alt={name} className="w-14 h-14 rounded-2xl object-contain bg-white border hairline p-2" />
        <div>
          <div className="font-extrabold text-slate-900">{name}</div>
          <div className="text-sm muted">{role}</div>
          <div className="text-xs muted mt-1">{office}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="badge badge-gold">✅ Doğrulanmış</span>
        <span className="badge badge-brand">🏢 Yetkili Ofis</span>
        <span className="badge">🛡️ Güvenli İletişim</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <a className="btn btn-primary w-full" href={waLink} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="btn w-full" href={telLink}>Ara</a>
      </div>

      <div className="mt-3 text-xs muted">
        * Numara: ilan içine <b>phone</b> / <b>agentPhone</b> eklersen otomatik kullanır.
      </div>
    </div>
  );
}
