import "../styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const run = () => {
      const ni = window.netlifyIdentity;
      if (!ni) return;

      // Token'lar bazen hash olarak gelir
      const h = window.location.hash || "";
      if (
        h.includes("recovery_token=") ||
        h.includes("invite_token=") ||
        h.includes("confirmation_token=")
      ) {
        ni.open(); // şifre belirleme / kurtarma UI
      }

      ni.on("login", () => {
        document.location.href = "/admin/";
      });
    };

    // script daha geç yüklenirse
    setTimeout(run, 300);
  }, []);

  return (
    <>
      <Script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}
