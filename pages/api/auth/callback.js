import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const auth = createOAuthAppAuth({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    });

    const { token } = await auth({
      type: "oauth-user",
      code,
    });

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
