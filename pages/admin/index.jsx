import Head from "next/head";
import { useEffect } from "react";

export default function AdminPage(){
  useEffect(() => {
    // Decap CMS global: window.CMS
    const t = setInterval(() => {
      if (typeof window !== "undefined" && window.CMS) {
        // Config'i kesin bu path'ten okusun
        window.CMS.init({ configFile: "/admin/config.yml" });
        clearInterval(t);
      }
    }, 50);

    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Head>
        <title>MyLifeVilla Admin</title>
        <meta name="robots" content="noindex,nofollow" />
        <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
      </Head>

      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        Admin yükleniyor...
        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 13 }}>
          Config: <code>/admin/config.yml</code>
        </div>
      </div>
    </>
  );
}
