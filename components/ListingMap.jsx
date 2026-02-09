import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function formatTRY(n){
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat("tr-TR").format(num);
}

// lat/lng yoksa ilçe merkezini yaklaşık koy
function fallbackLatLng(item){
  const d = String(item?.district || "").toLowerCase();
  if (d.includes("pendik")) return { lat: 40.879, lng: 29.258 };
  if (d.includes("tuzla")) return { lat: 40.816, lng: 29.301 };
  // İstanbul geneli (son çare)
  return { lat: 41.0082, lng: 28.9784 };
}

export default function ListingMap({ items = [] }){
  const points = items.map((x) => {
    const lat = Number(x.lat);
    const lng = Number(x.lng);
    const ok = Number.isFinite(lat) && Number.isFinite(lng);
    const pos = ok ? { lat, lng } : fallbackLatLng(x);
    return { ...x, _pos: pos, _ok: ok };
  });

  const center = points.length ? points[0]._pos : { lat: 40.879, lng: 29.258 };

  return (
    <div className="card overflow-hidden page-text">
      <div className="p-4 border-b hairline flex items-center justify-between">
        <div className="font-extrabold">Harita</div>
        <div className="text-xs muted">Pin’e tıkla → ilan</div>
      </div>

      <div style={{ height: 420 }}>
        <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((x) => (
            <Marker key={x.id} position={[x._pos.lat, x._pos.lng]}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>{x.title}</div>
                  <div style={{ fontSize: 12, opacity: .8 }}>{x.city} / {x.district}</div>
                  <div style={{ marginTop: 6, fontWeight: 800 }}>{formatTRY(x.price)} ₺</div>
                  <div style={{ marginTop: 8 }}>
                    <Link href={`/listing/${x.id}`} style={{ fontWeight: 800 }}>İlana git →</Link>
                  </div>
                  {!x._ok ? <div style={{ marginTop: 6, fontSize: 11, opacity: .7 }}>* Yaklaşık konum</div> : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
