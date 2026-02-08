
export default function MapEmbed({ query }) {
  if (!query) return null;
  const src = "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b hairline">
        <div className="font-extrabold">Harita</div>
        <div className="text-sm muted mt-1">{query}</div>
      </div>
      <div className="aspect-[16/10] bg-slate-100">
        <iframe
          title="map"
          src={src}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
