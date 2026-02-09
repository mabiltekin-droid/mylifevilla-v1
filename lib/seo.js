export const SITE_URL = "https://mylifevilla.netlify.app";

export function toAbsUrl(url){
  if (!url) return "";
  if (String(url).startsWith("http")) return url;
  return SITE_URL.replace(/\/$/,"") + "/" + String(url).replace(/^\//,"");
}

export function safeText(s, fallback=""){
  const t = (s ?? "").toString().trim();
  return t.length ? t : fallback;
}
