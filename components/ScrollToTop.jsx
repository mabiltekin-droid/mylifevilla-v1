import { useEffect, useState } from "react";

export default function ScrollToTop(){
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      className="btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ position:"fixed", right:16, bottom:16, zIndex:60 }}
      aria-label="Yukarı çık"
    >
      ↑ Yukarı
    </button>
  );
}
