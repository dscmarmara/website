// Writes SITE_METINLERI.md: every Turkish/English text the live site shows,
// page by page, read straight from the source files so it never drifts.
//
//   npm run site-texts
//
// Left out on purpose: members' own bios and quotes, blog posts, the shop,
// the (hidden) KPI labels, the dev options bar and the old-copy locales.
// Needs Node 23.6+ (imports .ts files directly).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOME_STATS, HOME_DEPARTMENTS, ABOUT_DEPARTMENTS } from "../src/lib/constants.ts";
import { SKILLS_TR } from "../src/lib/skills.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const en = readJson("messages/en.json");
const tr = readJson("messages/tr.json");
const { members } = readJson("src/data/members.json");

// Message keys that never show on the live site. Any key not listed here is
// documented automatically.
const EXCLUDED = [
  /^shop\./, /^metadata\.shop\./, "nav.shop", "footer.linkShop", // shop: preview only
  /^kpiLabels\./, // member KPIs are switched off
  "nav.englishOld", "nav.turkishOld", // dev options bar
  "metadata.siteName", "about.storyEst", "about.viewFullProfile", "blog.readArticle", // unused in code
];
const isExcluded = (key) => EXCLUDED.some((x) => (typeof x === "string" ? x === key : x.test(key)));

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]
  );
const enMap = new Map(flatten(en));
const trMap = new Map(flatten(tr));

const cell = (s) => String(s ?? "—").replace(/\|/g, "\\|").replace(/\n+/g, " ");
const table = (header, rows) =>
  [`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join("\n");

const documented = new Set();
function messageTable(...namespaces) {
  const rows = [];
  for (const [key, enValue] of enMap) {
    if (!namespaces.some((ns) => key.startsWith(`${ns}.`)) || isExcluded(key)) continue;
    documented.add(key);
    rows.push([`\`${key}\``, trMap.get(key), enValue]);
  }
  return table(["Anahtar", "Türkçe", "English"], rows);
}

// Plain role lines ("X, … departmanını eş direktör olarak yönetmektedir.") —
// anything else in bio1 is the member's own text and stays out.
const ROLE_LINE = /^[^,]{1,40}, (kulübün (başkanıdır|başkan yardımcısıdır|sekreteridir)|.+ departmanını (eş )?direktör olarak yönetmektedir)\.$/;

const out = [];
const h = (level, text) => out.push("", `${"#".repeat(level)} ${text}`, "");

out.push(
  "# DSC Marmara: sitedeki Türkçe ve İngilizce metinler",
  "",
  `> Bu dosya otomatik üretilir (${new Date().toISOString().slice(0, 10)}); elle düzenleme. Bir metni değiştirmek için`,
  "> `TRANSLATIONS.md`'de gösterilen dosyayı düzenle, sonra `npm run site-texts` ile bu dosyayı yenile.",
  ">",
  "> Dahil değil: üyelerin kendi yazdığı biyografi ve alıntılar, blog yazıları, mağaza, gizli KPI etiketleri,",
  "> DEV OPTIONS şeridi ve ESKİ metinler. Anahtar sütunu metnin dosyadaki yeridir (`messages/tr.json` / `en.json`)."
);

h(2, "1. Sekme başlıkları ve arama motoru açıklamaları");
out.push(messageTable("metadata"));

h(2, "2. Menü ve logo");
out.push(messageTable("nav", "brand"));

h(2, "3. Anasayfa");
out.push(messageTable("home"));
h(3, "Sayılar (`src/lib/constants.ts` → `HOME_STATS`)");
out.push(table(["Sayı", "Türkçe", "English"], HOME_STATS.map((s) => [s.num, s.label.tr, s.label.en])));
h(3, "Departman kartları (`src/lib/constants.ts` → `HOME_DEPARTMENTS`)");
out.push(table(["Departman", "Türkçe", "English"], HOME_DEPARTMENTS.map((d) => [`${d.no} ${d.name}`, d.desc.tr, d.desc.en])));

h(2, "4. Hakkımızda");
out.push(messageTable("about"));
h(3, "Departmanlar (`src/lib/constants.ts` → `ABOUT_DEPARTMENTS`)");
for (const d of ABOUT_DEPARTMENTS) {
  h(4, `${d.no} ${d.name}`);
  out.push(
    table(
      ["", "Türkçe", "English"],
      [
        ["Amaç", d.purpose.tr, d.purpose.en],
        ["Vizyon", d.vision.tr, d.vision.en],
        ["Odak etiketleri", (d.focusByLocale?.tr ?? d.focus).join(" · "), d.focus.join(" · ")],
      ]
    )
  );
}

h(2, "5. Ekip");
out.push(messageTable("team", "roles"));

h(2, "6. Üye profili");
out.push(messageTable("member"));
h(3, "Kısa tanıtımlar (`src/data/members.json` → `tagline`)");
out.push(table(["Üye", "Türkçe", "English"], members.map((m) => [m.name, m.tagline.tr, m.tagline.en])));
h(3, "Standart rol metinleri (`src/data/members.json` → `bio1`)");
out.push("Kendi biyografisini vermemiş üyelerde profilde görünen kalıp cümle.", "");
out.push(
  table(
    ["Üye", "Türkçe", "English"],
    members.filter((m) => ROLE_LINE.test(m.bio1.tr)).map((m) => [m.name, m.bio1.tr, m.bio1.en])
  )
);

h(2, "7. Odak alanı etiketleri (`src/lib/skills.ts`)");
out.push(table(["English", "Türkçe"], Object.entries(SKILLS_TR).map(([enLabel, trLabel]) => [enLabel, trLabel])));

h(2, "8. Blog");
out.push(messageTable("blog"));

h(2, "9. İletişim");
out.push(messageTable("contact"));

h(2, "10. Alt bilgi (footer)");
out.push(messageTable("footer"));

h(2, "11. 404 sayfası");
out.push(messageTable("notFound"));

h(2, "Tek dilde kalanlar");
out.push(
  "Bilerek çevrilmeyenler (ayrıntı: `TRANSLATIONS.md` → \"Türkçede de İngilizce kalanlar\"):",
  "",
  "- Departman adları (Data Insights, Core AI, Data Pipelines, Summits & Awards, Finance & Corporate, PR) ve footer'daki departman linkleri",
  "- Sosyal medya paylaşım görseli: \"DATA SCIENCE CLUB\", \"Marmara University\"",
  "- İletişim formundan kulübe gelen e-postanın konusundaki `[İletişim]` etiketi",
  "- Araç ve marka adı olan etiketler (Python, SQL, Power BI, Notion…)"
);

// Every live message key must have landed in exactly one section above.
const missing = [...enMap.keys()].filter((k) => !isExcluded(k) && !documented.has(k));
if (missing.length) throw new Error(`Message keys not placed in any section: ${missing.join(", ")}`);
const excludedCount = [...enMap.keys()].filter(isExcluded).length;

fs.writeFileSync(path.join(root, "SITE_METINLERI.md"), out.join("\n").trimStart() + "\n");
console.log(`SITE_METINLERI.md: ${documented.size} message keys, ${excludedCount} left out, ${members.length} members, ${Object.keys(SKILLS_TR).length} skill chips.`);
