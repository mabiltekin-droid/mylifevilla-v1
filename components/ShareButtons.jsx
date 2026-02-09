import { useEffect, useMemo, useState } from "react";

export default function ShareButtons({ title }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  const shareText = useMemo(() => {
    const t = (title || "MyLifeVilla ilanı").toString();
    return encodeURIComponent(t + "\n" + url);
  }, [title, url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link kopyalandı ✅");
    } catch {
      prompt("Kopyalamak için:", url);
    }
  };

  const wa = `https://wa.me/?text=${shareText}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "MyLifeVilla ilanı")}`;

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn" onClick={copy}>🔗 Linki kopyala</button>
      <a className="btn" href={wa} target="_blank" rel="noreferrer">📲 WhatsApp’ta paylaş</a>
      <a className="btn" href={tg} target="_blank" rel="noreferrer">✈️ Telegram</a>
    </div>
  );
}
