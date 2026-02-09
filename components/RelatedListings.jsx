import PropertyCard from "./PropertyCard";

function num(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function RelatedListings({ item, items = [] }) {
  const basePrice = num(item?.price);
  const baseArea = num(item?.area);

  let rel = (items || [])
    .filter(x => String(x.id) !== String(item.id))
    .filter(x => x.status === "Yayinda")
    .filter(x => x.district === item.district);

  // fiyat bandı ±%12 (fiyat varsa)
  if (basePrice !== null) {
    const lo = basePrice * 0.88;
    const hi = basePrice * 1.12;
    rel = rel.filter(x => {
      const p = num(x.price);
      return p === null ? true : (p >= lo && p <= hi);
    });
  }

  // oda benzerliği (varsa)
  if (item.rooms) {
    rel = rel.filter(x => !x.rooms || x.rooms === item.rooms);
  }

  // m² yakınlık (varsa)
  if (baseArea !== null) {
    rel = rel
      .map(x => ({ x, d: Math.abs((num(x.area) ?? baseArea) - baseArea) }))
      .sort((a,b) => a.d - b.d)
      .map(o => o.x);
  }

  rel = rel.slice(0, 6);

  if (!rel.length) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-extrabold" style={{ color: "#eaf2ef" }}>Benzer ilanlar</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rel.map(x => <PropertyCard key={x.id} item={x} />)}
      </div>
    </div>
  );
}
