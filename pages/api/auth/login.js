export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(500).send("Missing GITHUB_CLIENT_ID env var");
  }

  const redirectUri = "https://mylifevilla-v1.vercel.app/api/auth/callback";
  const scope = "repo";

  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`;

  res.redirect(302, url);
}
