export function isNew(createdAt, days=7){
  if (!createdAt) return false;
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return false;
  const ms = days * 24 * 60 * 60 * 1000;
  return (Date.now() - d.getTime()) <= ms;
}
