import Head from "next/head";

export default function AdminPage(){
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
          Eğer boş kalırsa config yolu: <code>/admin/config.yml</code>
        </div>
      </div>
    </>
  );
}
