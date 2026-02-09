export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Missing ?code");
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return res.status(500).send("Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET");
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await tokenRes.json();

    // GitHub hata döndürürse burada yakalarız:
    // { error, error_description, error_uri }
    if (!tokenRes.ok || data.error) {
      return res
        .status(500)
        .json({ where: "github_access_token", ...data });
    }

    if (!data.access_token) {
      return res.status(500).json({ where: "no_access_token", data });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(
      JSON.stringify({
        token: data.access_token,
        provider: "github",
      })
    );
  } catch (e) {
    return res.status(500).json({ where: "callback_exception", message: String(e?.message || e) });
  }
}
