
import { useMemo, useRef } from "react";
import PropertyCard from "./PropertyCard";

export default function FeaturedCarousel({ items = [] }) {
  const list = useMemo(() => (items || []).filter(Boolean), [items]);
  const sc = useRef(null);

  const scrollBy = (dx) => {
    if (!sc.current) return;
    sc.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  if (list.length === 0) return null;

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-extrabold">Vitrin</h2>
        <div className="flex gap-2">
          <button className="btn" onClick={() => scrollBy(-420)}>←</button>
          <button className="btn" onClick={() => scrollBy(420)}>→</button>
        </div>
      </div>

      <div ref={sc} className="flex gap-4 overflow-auto pb-2 snap-x snap-mandatory">
        {list.map((item) => (
          <div key={item.id} className="min-w-[280px] sm:min-w-[340px] snap-start">
            <PropertyCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
