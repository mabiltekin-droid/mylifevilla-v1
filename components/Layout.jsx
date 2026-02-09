import Head from "next/head";
import Navbar from "./Navbar";
import { SITE_URL, safeText, toAbsUrl } from "../lib/seo";

export default function Layout({
  children,
  title = "MyLifeVilla | Pendik & Tuzla Emlak",
  desc = "Pendik ve Tuzla bölgesinde satılık & kiralık emlak ilanları. Öne çıkan ilanlar, filtreleme ve detay sayfaları.",
  image = "/og.jpg",
  path = "/",
}) {
  const metaTitle = safeText(title, "MyLifeVilla");
  const metaDesc = safeText(desc, "Pendik ve Tuzla emlak ilanları.");
  const canonical = SITE_URL.replace(/\/$/,"") + safeText(path, "/");
  const ogImage = toAbsUrl(image);

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <Navbar />
      <main className="container-max py-8">{children}</main>
    </>
  );
}
