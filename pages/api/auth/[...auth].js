import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    // GitHub login'e yönlendir
    const redirect = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
    res.redirect(302, redirect);
    return;
  }

  try {
    const auth = createOAuthAppAuth({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    });

    const { token } = await auth({ type: "oauth-user", code });

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(
      JSON.stringify({
        token,
        provider: "github",
      })
    );
  } catch (e) {
    res.status(500).json({ error: "OAuth failed" });
  }
}
