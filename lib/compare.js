const KEY = "mylifevilla:compare";

export function getCompare(){
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch { return []; }
}

export function setCompare(ids){
  if (typeof window === "undefined") return;
  const uniq = Array.from(new Set((ids || []).map(String))).slice(0, 3);
  localStorage.setItem(KEY, JSON.stringify(uniq));
}

export function toggleCompare(id){
  const sid = String(id);
  const cur = getCompare();
  let next = cur.includes(sid) ? cur.filter(x => x !== sid) : [...cur, sid];
  next = Array.from(new Set(next)).slice(0, 3);
  setCompare(next);
  return next;
}

export function isCompared(id){
  return getCompare().includes(String(id));
}
