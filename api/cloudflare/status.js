/**
 * Ozlind Cloudflare connection check.
 *
 * Required Vercel environment variable:
 *   CLOUDFLARE_API_TOKEN
 *
 * The token is used only on the server and is never returned to the browser.
 * Start with a least-privilege Cloudflare API token.
 */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    return res.status(200).json({
      ok: true,
      provider: "cloudflare",
      state: "not_configured",
      message: "Add CLOUDFLARE_API_TOKEN in Vercel Project Environment Variables."
    });
  }

  try {
    const response = await fetch(
      "https://api.cloudflare.com/client/v4/user/tokens/verify",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        signal: AbortSignal.timeout(10000)
      }
    );

    const data = await response.json().catch(() => null);
    if (!response.ok || !data || data.success !== true) {
      return res.status(502).json({
        ok: false,
        provider: "cloudflare",
        state: "verification_failed",
        message: "Cloudflare could not verify the configured token. Check its validity and permissions."
      });
    }

    return res.status(200).json({
      ok: true,
      provider: "cloudflare",
      state: "connected",
      tokenStatus: data.result && data.result.status ? data.result.status : "active"
    });
  } catch (_error) {
    return res.status(502).json({
      ok: false,
      provider: "cloudflare",
      state: "unreachable",
      message: "Could not reach Cloudflare. Try again later."
    });
  }
};
