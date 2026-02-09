const KEY = "mylifevilla:favorites";

export function getFavorites(){
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export function setFavorites(ids){
  if (typeof window === "undefined") return;
  const uniq = Array.from(new Set((ids || []).map(String)));
  localStorage.setItem(KEY, JSON.stringify(uniq));
}

export function isFav(id){
  const ids = getFavorites();
  return ids.includes(String(id));
}

export function toggleFav(id){
  const sid = String(id);
  const ids = getFavorites();
  const next = ids.includes(sid) ? ids.filter(x => x !== sid) : [...ids, sid];
  setFavorites(next);
  return next;
}
