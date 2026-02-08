export default function MapEmbed({ query }) {
  if (!query) return null;

  const src =
    "https://www.google.com/maps?q=" +
    encodeURIComponent(query) +
    "&output=embed";

  return (
    <div className="card overflow-hidden">
      <div className="aspect-[16/10]">
        <iframe
          src={src}
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
