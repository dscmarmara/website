// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) that the live
// site changed, so they recrawl it soon instead of on their own schedule.
// Run after a release, once Vercel has finished deploying main:
//
//   npm run indexnow
//
// It reads every URL from the live sitemap and submits them in one request.
// The key is the file public/<key>.txt (IndexNow checks it on the site to prove
// ownership). Google does not use IndexNow: resubmit the sitemap in Search
// Console instead.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dscmarmara.com.tr").replace(/\/$/, "");
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const keyFile = fs.readdirSync(path.join(root, "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (public/<32 hex>.txt) found.");
const key = keyFile.slice(0, -4);

// The key file must already be live, or the search engines reject the submission.
const keyRes = await fetch(`${SITE_URL}/${keyFile}`);
if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
  throw new Error(`${SITE_URL}/${keyFile} is not live yet (HTTP ${keyRes.status}). Release first, then run this.`);
}

const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
const urls = [...new Set([...sitemap.matchAll(/https?:\/\/[^"<\s]+/g)].map((m) => m[0]).filter((u) => u.startsWith(SITE_URL)))];
if (urls.length === 0) throw new Error("No URLs found in the sitemap.");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE_URL).host, key, keyLocation: `${SITE_URL}/${keyFile}`, urlList: urls }),
});
// 200 = accepted, 202 = accepted, key check pending; anything else is an error.
console.log(`IndexNow: ${urls.length} URLs submitted, HTTP ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(await res.text());
  process.exitCode = 1;
}
