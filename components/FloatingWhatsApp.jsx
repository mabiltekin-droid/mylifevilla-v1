
export default function FloatingWhatsApp({ phone, title }) {
  if (!phone) return null;

  const clean = String(phone).replace(/[^0-9]/g, "");
  const wa =
    clean.length === 10 ? "90" + clean :
    (clean.startsWith("90") ? clean : clean);

  const text = encodeURIComponent(`Merhaba, "${title}" ilanı hakkında bilgi alabilir miyim?`);
  const href = `https://wa.me/${wa}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 shadow-xl"
      aria-label="WhatsApp ile yaz"
      title="WhatsApp ile yaz"
    >
      <span className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-extrabold border hairline bg-emerald-600 text-white hover:bg-emerald-700">
        <span className="text-lg">💬</span>
        WhatsApp
      </span>
    </a>
  );
}
