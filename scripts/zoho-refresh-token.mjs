// One-time helper: turn a Zoho Self Client grant code into a permanent refresh token.
//
//   1. api-console.zoho.eu → your Self Client → "Generate Code" tab
//      Scope: ZohoMail.messages.CREATE,ZohoMail.accounts.READ
//      Duration: 10 minutes  → copy the code (it expires fast, so run this straight after)
//   2. Put ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in .env.local
//   3. node scripts/zoho-refresh-token.mjs <grant_code>
//   4. Paste the printed ZOHO_REFRESH_TOKEN into .env.local (and Vercel)
//
// Zoho's docs don't say whether a Self Client needs redirect_uri for this
// exchange, so we try without it and retry with it rather than guessing.

if (!process.env.ZOHO_CLIENT_ID) {
  try {
    process.loadEnvFile(".env.local"); // Node 20.12+/24
  } catch {
    /* no .env.local — fall through to the check below */
  }
}

const CLIENT_ID = process.env.ZOHO_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET?.trim();
const REGION = (process.env.ZOHO_REGION ?? "eu").trim();
const code = process.argv[2]?.trim();

const fail = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

if (!CLIENT_ID || !CLIENT_SECRET) {
  fail("ZOHO_CLIENT_ID / ZOHO_CLIENT_SECRET are missing from .env.local.");
}
if (!code) {
  fail("No grant code given.\n\n  Usage: node scripts/zoho-refresh-token.mjs <grant_code>");
}

const TOKEN_URL = `https://accounts.zoho.${REGION}/oauth/v2/token`;

async function exchange(withRedirect) {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
  });
  // Self Client has no real callback; Zoho accepts this placeholder when the
  // parameter is required at all.
  if (withRedirect) params.set("redirect_uri", "https://www.dscmarmara.com.tr/");

  const res = await fetch(`${TOKEN_URL}?${params}`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && Boolean(data.refresh_token), status: res.status, data };
}

console.log(`\nExchanging grant code at ${TOKEN_URL} …`);

let attempt = await exchange(false);
if (!attempt.ok) {
  console.log(`  without redirect_uri → ${attempt.status} ${JSON.stringify(attempt.data)}`);
  console.log("  retrying with redirect_uri …");
  attempt = await exchange(true);
}

if (!attempt.ok) {
  console.error(`\n✗ Exchange failed (${attempt.status}):`);
  console.error(JSON.stringify(attempt.data, null, 2));
  const err = attempt.data?.error;
  if (err === "invalid_code") {
    console.error("\n→ 'invalid_code' almost always means the code expired (10 min) or was already used.");
    console.error("  Generate a fresh code in the console and run this again immediately.");
  } else if (err === "invalid_client") {
    console.error("\n→ 'invalid_client' means the client id/secret don't match, or they belong to a");
    console.error(`  different data centre than ZOHO_REGION=${REGION} (check accounts.zoho.${REGION}).`);
  }
  process.exit(1);
}

const { refresh_token, access_token, expires_in, api_domain, scope } = attempt.data;
console.log("\n✓ Success. Add this line to .env.local (and to Vercel):\n");
console.log(`ZOHO_REFRESH_TOKEN=${refresh_token}\n`);
console.log("Details:");
console.log(`  scope       : ${scope ?? "(not reported)"}`);
console.log(`  api_domain  : ${api_domain ?? "(not reported)"}`);
console.log(`  access token: ${access_token ? `ok, expires in ${expires_in}s` : "missing"}`);
console.log("\nThe refresh token does not expire — store it once and keep it secret.\n");
