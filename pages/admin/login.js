export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const real = process.env.ADMIN_PASSWORD;
  if (!real) return res.status(500).json({ error: "ADMIN_PASSWORD env ayarlı değil." });

  const { password } = req.body || {};
  if (password !== real) return res.status(401).json({ error: "Şifre yanlış." });

  // 7 gün giriş
  res.setHeader(
    "Set-Cookie",
    `admin_auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; Secure`
  );
  return res.status(200).json({ ok: true });
}
