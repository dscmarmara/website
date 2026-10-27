// SEO check of every URL in the sitemap (both languages):
//
//   npm run seo-audit                          # the live site
//   npm run seo-audit http://localhost:3000    # a local build (e.g. staging, before release)
//
// Staging sits behind Vercel's login, so check it as a local copy:
//   NEXT_PUBLIC_SITE_STAGE=staging npm run build && npx next start
//   npm run seo-audit http://localhost:3000
//
// Per page: HTTP 200; <title> ≤ 60 characters; description 70–160 characters;
// no em dash in either; canonical = the page itself; hreflang en, tr and
// x-default; og:url (if set) = the page; og:image present and loading; JSON-LD
// valid JSON; Person and BlogPosting data complete. Exits with 1 on any problem.

const SITE = "https://www.dscmarmara.com.tr";
const BASE = (process.argv[2] ?? SITE).replace(/\/$/, "");
const dec = (s) => s?.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const local = (u) => u.replace(SITE, BASE);

const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urls = [...new Set([...locs, ...[...sitemap.matchAll(/href="([^"]+)"/g)].map((m) => m[1])])];
console.log(`${BASE}: sitemap ${locs.length} entries, ${urls.length} URLs, x-default ${(sitemap.match(/hreflang="x-default"/g) || []).length}`);

let problems = 0;
for (const u of urls) {
  const res = await fetch(local(u));
  const html = await res.text();
  const head = (html.match(/<head>[\s\S]*?<\/head>/) || [""])[0];
  const meta = (attr, name) => dec((head.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || [])[1]);
  const path = u.replace(SITE, "") || "/";
  const title = dec((head.match(/<title>([^<]*)<\/title>/) || [])[1]) ?? "";
  const desc = meta("name", "description") ?? "";
  const canonical = ((head.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || "").replace(SITE, "") || "/";
  const hreflang = [...head.matchAll(/hrefLang="([^"]+)"/g)].map((m) => m[1]).sort().join(",");
  const ogImage = meta("property", "og:image");
  const ogUrl = meta("property", "og:url");
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  });
  const h1 = (html.replace(/<head>[\s\S]*?<\/head>/, "").match(/<h1[\s>]/g) || []).length;

  const issues = [];
  if (res.status !== 200) issues.push(`HTTP ${res.status}`);
  if (title.length > 60) issues.push(`title ${title.length} chars`);
  if (desc.length < 70 || desc.length > 160) issues.push(`description ${desc.length} chars`);
  if ((title + desc).includes("—")) issues.push("em dash");
  if (canonical !== path) issues.push(`canonical ${canonical}`);
  // The homepage's URL is the bare origin (no "/"), as for the canonical above.
  if (ogUrl && (ogUrl.replace(SITE, "") || "/") !== path) issues.push(`og:url ${ogUrl}`);
  if (hreflang !== "en,tr,x-default") issues.push(`hreflang ${hreflang || "none"}`);
  if (h1 !== 1) issues.push(`${h1} h1`);
  if (lds.includes(null)) issues.push("invalid JSON-LD");
  if (!ogImage) issues.push("no og:image");
  else if (!(await fetch(local(ogImage.replace(/\?.*/, "")))).ok) issues.push("og:image does not load");
  const person = lds.find((x) => x?.["@type"] === "Person");
  if (person && (!person.image || !person.description || person.jobTitle === person.jobTitle?.toLocaleUpperCase("tr"))) issues.push("Person data incomplete");
  const post = lds.find((x) => x?.["@type"] === "BlogPosting");
  if (post && (!post.image || !post.url || !post.publisher?.logo)) issues.push("BlogPosting data incomplete");

  if (issues.length) problems++;
  console.log(`${path.padEnd(52)} title ${String(title.length).padStart(2)}  desc ${String(desc.length).padStart(3)}  ${issues.length ? "!! " + issues.join("; ") : "ok"}`);
}
console.log(`${urls.length} URLs, ${problems} with problems`);
if (problems) process.exitCode = 1;
