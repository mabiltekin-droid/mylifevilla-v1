import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing ?code");

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) return res.status(500).send("Missing GitHub env vars");

    const auth = createOAuthAppAuth({ clientId, clientSecret });
    const { token } = await auth({ type: "oauth-user", code });

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({ token, provider: "github" }));
  } catch (e) {
    res.status(500).send("OAuth failed");
  }
}
