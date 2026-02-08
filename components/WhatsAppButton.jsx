
export default function WhatsAppButton({ phone, title }) {
  if (!phone) return null;
  const clean = String(phone).replace(/[^0-9]/g, "");
  // TR için +90 yoksa ekle (10 haneli gsm vs)
  const wa = clean.length === 10 ? "90" + clean : (clean.startsWith("90") ? clean : clean);
  const text = encodeURIComponent(`Merhaba, "${title}" ilanı hakkında bilgi alabilir miyim?`);
  const href = `https://wa.me/${wa}?text=${text}`;

  return (
    <a className="btn btn-primary w-full" href={href} target="_blank" rel="noreferrer">
      WhatsApp ile yaz
    </a>
  );
}
