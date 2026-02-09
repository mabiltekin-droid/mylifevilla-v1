import { useMemo } from "react";

export default function VisitRequestForm({ item }) {
  const formName = "visit-request";
  const subject = useMemo(() => {
    return `Ziyaret Talebi • ${item?.title || "İlan"} • ${item?.id || ""}`;
  }, [item]);

  return (
    <div className="card p-5 page-text">
      <div className="font-extrabold text-slate-900">Ziyaret talebi</div>
      <p className="mt-2 muted text-sm">
        Bilgilerini bırak; sana geri dönüş yapalım.
      </p>

      {/* Netlify Forms */}
      <form
        name={formName}
        method="POST"
        action="/thanks"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className="mt-4 space-y-3"
      >
        <input type="hidden" name="form-name" value={formName} />
        <input type="hidden" name="subject" value={subject} />
        <input type="hidden" name="listingId" value={String(item?.id || "")} />
        <input type="hidden" name="listingTitle" value={String(item?.title || "")} />

        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-extrabold muted mb-1">Ad Soyad</div>
            <input name="name" required className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85" />
          </div>
          <div>
            <div className="text-xs font-extrabold muted mb-1">Telefon</div>
            <input name="phone" required inputMode="tel" className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85" />
          </div>
        </div>

        <div>
          <div className="text-xs font-extrabold muted mb-1">Mesaj</div>
          <textarea name="message" rows="4" className="w-full border hairline rounded-2xl px-4 py-2 bg-white/85"
            placeholder="Uygun olduğum zaman aralığı: ..."></textarea>
        </div>

        <button className="btn btn-primary w-full" type="submit">Gönder</button>

        <div className="text-xs muted">
          Gönderince Netlify panelinde “Forms” kısmına düşer.
        </div>
      </form>
    </div>
  );
}
