export default function handler(req, res) {
  // Decap CMS /api/auth açınca login’e gitsin
  res.redirect(302, "/api/auth/login");
}
