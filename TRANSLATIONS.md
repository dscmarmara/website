# Türkçe metinler nerede?

Site İngilizce (`/`) ve Türkçe (`/tr`) yayınlanıyor. Türkçe metinleri elle düzeltmek için
aşağıdaki dosyalara bakman yeterli. Kod bilgisi gerekmiyor; sadece tırnak içindeki
**değerleri** değiştir.

Değişikliği görmek için: `npm run dev` → <http://localhost:3737/tr> (telefondan aynı ağda denemek için
`npm run dev:lan`)

Sitedeki bütün TR/EN metinlerin tek sayfalık dökümü: `SITE_METINLERI.md` (`npm run site-texts` ile yenilenir).

## Geçici: metin sürümleri (ESKİ / YENİ 1 / YENİ 2)

Preview'da metnin üç sürümü yan yana duruyor (arama motorlarına kapalı, canlıda 404):

| Sürüm | Adres | Ne | Arayüz metinleri | `constants.ts` / `members.json` alanları |
|---|---|---|---|---|
| TR / EN YENİ 2 (varsayılan) | `/tr`, `/` | en yeni metin, yayına alınacak aday | `messages/tr.json`, `en.json` | `tr:` / `en:` |
| TR / EN YENİ 1 | `/tr-x-v1`, `/en-x-v1` | ilk yeni metin | `messages/tr-x-v1.json`, `en-x-v1.json` | `"tr-x-v1":` / `"en-x-v1":` |
| TR / EN ESKİ | `/tr-x-eski`, `/en-x-eski` | şu an canlıdaki (`main`) metin | `messages/tr-x-eski.json`, `en-x-eski.json` | `"tr-x-eski":` / `"en-x-eski":` |

Sürüm anahtarları (`"tr-x-v1"` gibi) yalnızca o sürümde metnin farklı olduğu alanlarda yazılı; olmayan yerde `tr` / `en`
değeri görünür. Sitenin ilk metinleri koddan çıkarıldı, `ESKI_METINLER.md`'de arşivde.

YENİ 2'de Ekip ve üye profilleri önceki canlı metinle aynı. Hakkımızda'da "Hikâyemiz" metni
(`about.storyP1`–`storyP3`, `about.pullQuote`) ve departmanların Amaç / Vizyon / Odak alanları kulübün altyapı
sunumundan (DSC_ALTYAPI_TANITIM) uyarlanmış metinler. Anasayfa departman kartları önceki canlıdaki kısa metinler.
`footer.description` yeni.

**Karşılaştırma:**
- Menünün altındaki **DEV OPTIONS** şeridinde **TR ESKİ | TR YENİ 1 | TR YENİ 2** ve İngilizcesi; aynı sayfada sürümler
  arasında geçilir.
- **Yan yana:** şeritteki **"Yan yana →"** ya da `/karsilastir` adresi. İki sürüm seçilir (ör. sol TR YENİ 2, sağ
  EN YENİ 2) ve aynı sayfa iki çerçevede açılır. Bir tarafta linke tıklanınca öbürü de aynı sayfaya gider; kaydırma
  eşlenir. Seçimler adreste durur (`?sol=…&sag=…&sayfa=…`), link paylaşılabilir.
- **Farklar:** şeritteki ya da yan yana sayfasındaki **"Farklar →"**, ya da `/karsilastir/farklar` adresi. İki sürüm
  arasında değişen bütün metinler sayfa sayfa listelenir (varsayılan ESKİ → YENİ 2); silinen kelimeler kırmızı ve üstü
  çizili, eklenenler yeşil. Dil süzgeci (TR / EN / ikisi) ve "Değişmeyenleri de göster" var; her bölümdeki
  "Sayfada gör →" o sayfayı iki sürümde yan yana açar. Seçimler adreste durur (`?once=eski&sonra=v2&dil=tr`). Metinler
  `src/lib/textInventory.ts`'te sitenin kendi okuma kurallarıyla toplanır; blog yazıları dahil değil. Paslaşma
  bölümünün metinleri, sayfadaki gibi yalnızca **Paslaşma AÇIK** iken listelenir.
- **Font:** şeritteki **"Font →"** ya da `/karsilastir/font`. Sitedeki el yazısı başlıklar iki satırda: ÖNCE (Condiment;
  eksik Ğ ğ İ Ş ş ve ı Pacifico'dan) ve SONRA (DSC Script). Değişen harflerin altı çizili.
- Şerit, `/karsilastir`, `/karsilastir/farklar` ve `/karsilastir/font` canlıda ve staging'de yok; sürüm adresleri
  orada 404.

**Başlık fontu (DSC Script):** hero başlıklarındaki el yazısı font, Condiment'e eksik Türkçe harflerin (Ğ ğ İ Ş ş)
fontun kendi harf ve aksanlarından eklenmiş hali (`src/fonts/dsc-script/`, OFL; özgün dosya `src/fonts/condiment/`
kaynak olarak duruyor). Yeniden üretmek ya da aksan yerini ayarlamak için `scripts/build-script-font.mjs` →
`TUNE()` ve `node scripts/build-script-font.mjs`.

Menüdeki tek dil düğmesi (Türkçede "EN" → `/`, İngilizcede "TR" → `/tr`) her zaman öteki dilin YENİ 2'sine gider.

Bir metni değiştirirken öncekini karşılaştırmada tutmak istersen: mesaj dosyalarında yeni metni sadece `tr.json` /
`en.json`'a yaz; `constants.ts` / `members.json`'da eski değeri ilgili sürüm anahtarına taşı.

Sürümlerin diğer parçaları:
- Hakkımızda odak etiketleri: `ABOUT_DEPARTMENTS[].focusByLocale` → `tr` (TR YENİ 2) ve sürüm listeleri; İngilizce
  YENİ 2 listesi `focus`.
- Üye etiketleri: bir sürümde farklı okunan etiketler `src/lib/skills.ts` → `SKILLS_TR_BY_VERSION`.
- Hakkımızda'daki "Departmanlar arası paslaşma" bölümü (`ABOUT_FLOW` + `about.flow*` metinleri) **önizleme**:
  DEV OPTIONS'taki ya da yan yana sayfasındaki **"Paslaşma"** düğmesiyle açılıp kapanır (tarayıcı hatırlar), canlıda
  hiç görünmez (`src/components/dev/DevFlagGate.tsx`). YENİ 1 ve YENİ 2'de var, ESKİ'de yok. Kalıcı yapmak için
  `about/page.tsx`'teki `<DevFlagGate flag="flow">` sarmalını kaldır.
- Blog yazılarının ve üyelerin kendi biyografilerinin ayrı sürümleri yok.

**Bir sürümü kaldırmak** (ör. YENİ 1 artık gerekmiyorsa): `messages/*-x-v1.json`'u sil; `constants.ts` /
`members.json`'daki `"tr-x-v1"` / `"en-x-v1"` girdilerini ve `SKILLS_TR_BY_VERSION["tr-x-v1"]`'i kaldır;
`src/i18n/routing.ts` → `REVIEW_LOCALES` ve `src/lib/copyVersions.ts` → `COPY_VERSIONS` / `TEXT_VERSIONS`'tan çıkar;
`src/lib/textInventory.ts`'teki `messages/*-x-v1.json` importlarını kaldır.

**Yayın akışı (üç dal):**

| Dal | Ne için | Görünüş |
|---|---|---|
| `preview-development` | Geliştirme, denemeler, çoklu kurulumlar | Önizleme: DEV OPTIONS, sürümler, mağaza, projeler, taslak yazılar açık |
| `staging` | Canlının birebir kopyası: son kontrol, küçük düzeltmeler, sadeleştirme, SEO denetimi | Canlı gibi: canlıda kapalı olan her şey burada da kapalı |
| `main` | Canlı site (www.dscmarmara.com.tr) | Canlı |

1. Geliştirme `preview-development`'ta yapılır; her push bir Vercel Preview'dır.
2. Hazır olunca staging'e terfi edilir: `git push origin preview-development:staging`.
3. Staging adresinde site canlıdaki haliyle kontrol edilir:
   - Adres: https://website-git-staging-coolsadik11s-projects.vercel.app (Vercel'in dal adresi, her zaman staging'in
     son halini gösterir; açmak için Vercel girişi gerekir). Önizlemenin karşılığı:
     https://website-git-preview-development-coolsadik11s-projects.vercel.app
   - Vercel bir dalı ancak o dala yeni commit gelince deploy eder. Dal yalnızca var olan bir commit'le açıldıysa
     (ilk kurulumda olduğu gibi) adres `DEPLOYMENT_NOT_FOUND` verir. Bir sonraki terfi deploy'u başlatır.
   - İstenirse Vercel → Settings → Domains'ten `staging.dscmarmara.com.tr` gibi bir alt alan adı bu dala
     bağlanabilir (DNS kaydı da gerekir).
   - SEO denetimi:
     `NEXT_PUBLIC_SITE_STAGE=staging npm run build && npx next start` → `npm run seo-audit http://localhost:3000`
     (canlıya karşı yalnızca `npm run seo-audit`).
   - Güvenlik: `npm audit` 0 açık göstermeli (bkz. "Güvenlik" aşağıda).
4. Canlıya alma: `git push origin staging:main`.
5. **Staging'de düzeltme commit'i atıldıysa** onu `preview-development`'a geri al:
   `git checkout preview-development && git merge origin/staging && git push`. Böylece dallar ayrışmaz ve terfiler
   hep fast-forward kalır. `main`'e doğrudan commit atılmaz.

Staging'in canlı gibi davranması `next.config.ts` → `NEXT_PUBLIC_SITE_STAGE`'den gelir: Vercel production →
`production`, `staging` dalı → `staging`, diğer Vercel dalları ve `npm run dev` → `preview`. Nerede çalıştığı
anlaşılamayan derleme (ör. yerelde düz `npm run build`) **canlı** sayılır; yerelde önizlemeyi derlemek için
`NEXT_PUBLIC_SITE_STAGE=preview npm run build`. Canlıda kapalı olan her şey `IS_PRODUCTION`'a (`src/lib/env.ts`) bakar
ve bu bayrak staging'de de doğrudur. Staging'in canlıdan tek farkları:
- İletişim formundan gelen e-postanın konusunda `[STAGING]` yazar.
- Vercel önizleme adreslerine `X-Robots-Tag: noindex` koyduğu için arama motorlarına girmez.
- IndexNow yalnızca `main` yayınından sonra çalıştırılır.

Yerelde başka modda yeniden derlemeden önce açık `next start`'ı kapat: çalışmaya devam eden eski sunucu, yeni
derlemenin `.next/server/route-cache`'ine kendi modunun sonuçlarını (ör. staging'in 404'lerini) yazar ve yeni sunucu
onları sunar. Şüphede `.next/server/route-cache`'i sil.

**Güvenlik:**
- **Bağımlılıklar:** yayından önce `npm audit` 0 açık göstermeli. Next ve React güvenlik duyurularını takip et
  (nextjs.org/blog); yamalı sürüme geçiş staging'den geçer. `next` ve `react` tam sürümle sabit.
- **Başlıklar:** CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy `next.config.ts` → `headers()`.
  Sitede dışarıdan betik, stil, font, iframe yok; yeni bir dış kaynak (analitik, gömülü video vb.) eklenirse CSP'ye
  de eklenmeli, yoksa tarayıcı engeller. Önizleme ve staging'de Vercel araç çubuğu (`vercel.live`) ayrıca izinli.
- **İletişim formu:**
  - Vercel BotID (Basic, ücretsiz) korur: `src/instrumentation-client.ts` + `actions.ts` → `checkBotId()`. Vercel →
    Settings → Security'de **OIDC Federation açık olmalı**; kapalıysa kontrol hata verir, form yine çalışır
    (hata kayıtlarda "BotID check failed") ama bot koruması devre dışı kalır.
  - Ziyaretçi başına 10 dakikada 3 mesaj, sunucu başına günde 40 mesaj sınırı var. Alan sınırları
    `src/lib/contactRules.ts`'te; form ve sunucu aynı kuralları kullanır.
  - `ZOHO_*` değişkenleri Vercel'de "Sensitive" olmalı ve yalnızca Production ile `staging` dalına tanımlı olmalı.
    Yerelde `.env.local`'da tanımlıysa yerel form **gerçekten mail gönderir**. Yerel testte mail gitmesin diye
    sunucuyu `ZOHO_CLIENT_ID= ZOHO_CLIENT_SECRET= ZOHO_REFRESH_TOKEN= npx next start` ile başlat.

**Geliştirici notları (Next 16.4 düzeni):**
- **Dil:** kök layout `src/app/[locale]/layout.tsx`; dil `next/root-params` ile `src/i18n/request.ts`'te okunur.
  Sayfalarda `setRequestLocale` gerekmez (next-intl'de artık "legacy"). Dil dışı adresler (`/missing.html`, canlıda
  sürüm dilleri) `src/app/global-not-found.tsx`'e düşer; dil içindeki eksik sayfalar `[locale]/not-found.tsx`'e.
- **Çeviri kullanan istemci bileşeni:** layout istemciye hiç mesaj göndermez (`messages={null}`). `useTranslations`
  kullanan yeni bir `"use client"` bileşeni, render edildiği sayfada
  `<ClientMessages namespaces={["ad-alani"]}>` ile sarılmalı (`src/components/i18n/ClientMessages.tsx`), yoksa
  çeviri bulunamaz. Mümkünse metni sunucudan prop olarak vermek daha iyi (menü böyle).
- **Menü:** sunucuda çizilir (`Nav.tsx`); yalnızca `NavLink`, `MobileMenu`, `LocaleSwitch` istemcide. Link listesi
  `src/components/layout/navLinks.ts`. Geliştirici şeridi yalnızca önizleme derlemesine girer.
- **Stiller:** paylaşılan/tekrarlanan bileşenlerin stilleri `globals.css` sonundaki "Component styles" bölümünde
  sınıf. Bir öğenin `:hover`/`:focus`/medya kuralıyla çakışan özellikleri bilerek satır içi bırakıldı; onları
  sınıfa taşımak o kuralı devreye sokar ve görünümü değiştirir.
- **Belgeler:** Next'in sürüme uygun belgeleri `node_modules/next/dist/docs/`; diğer kütüphaneler için Context7.

**Yayından sonra arama motorları:** Vercel canlı deploy'u bitince `npm run indexnow` çalıştır. Canlı sitemap'teki
bütün adresleri IndexNow'a (Bing, Yandex vb.) bildirir; anahtar `public/<anahtar>.txt` dosyası. Google IndexNow
kullanmıyor: Google Search Console → Site haritaları'ndan `sitemap.xml`'i yeniden gönder. Arama sonuçlarındaki başlık ve
açıklamalar `messages/*.json` → `metadata.*`'tan gelir (≤ ~160 karakter tut).

**Açık notlar (karar bekliyor):**

- **Mağaza yer tutucularla duruyor, yayına almadan önce değiştir.** Hepsi `src/lib/constants.ts` içinde:
  - WhatsApp numarası `SHOP_WHATSAPP` sahte (`905555555555`).
  - Fiyatlar ve ürün açıklamaları `SHOP_PRODUCTS` içinde örnek değerler.
  - Ürün görselleri çizim (`src/components/shop/ProductArt.tsx`). Fotoğraflar gelince kartta `next/image` ile değiştirilir.
- **Mağaza canlı sürümde kapalı.** Menüde ve footer'da yok, sitemap'te yok; canlıda `/shop` 404 verir
  (`src/lib/env.ts` → `IS_PRODUCTION`). Preview'da Dev options şeridindeki **"Önizleme: Mağaza →"** linkiyle açılır.
  Açmak için: `src/app/[locale]/shop/page.tsx`'teki `IS_PRODUCTION` kontrollerini kaldır, `Nav.tsx` `NAV_LINKS`'e
  `{ key: "shop", href: "/shop" }`, `Footer.tsx`'e `footer.linkShop` linkini, `src/app/sitemap.ts`'e `"/shop"`'u ekle.
  (Mesaj anahtarları duruyor.)
- **Üye rakamları (KPI) uydurma, şu an kapalı.** Veriler `src/data/members.json` → her üyenin `kpis` listesinde duruyor
  (örn. "16 DASHBOARDS") ama gösterilmiyor; profil sayfasında rakam şeridi de çizilmiyor. Gerçek rakamlar girilince
  `src/app/[locale]/team/[slug]/page.tsx`'teki `SHOW_KPIS`'i `true` yap, şerit geri gelir.
- **Kendi metnini vermemiş üyelerde sade rol metni var** (ör. "Emirhan, Data Insights departmanını eş direktör olarak
  yönetiyor."). Üye kendi metnini gönderince `tr` / `en` değerlerine yazılır.

**Bütün sürüm karşılaştırmasını kaldırmak** (artık gerekmediğinde):

1. `messages/*-x-eski.json` ve `messages/*-x-v1.json`'u sil.
2. `src/lib/constants.ts` ve `src/data/members.json`'daki bütün `"*-x-eski"` / `"*-x-v1"` satırlarını sil
   (`focusByLocale` içindekiler dahil) ve `src/lib/skills.ts`'teki `SKILLS_TR_BY_VERSION`'ı kaldır.
3. Kod tarafını kaldır:
   - `src/i18n/routing.ts` içindeki `REVIEW_LOCALES` / `isReviewLocale` ve onları kullanan yerler (`src/lib/seo.ts`, `src/app/[locale]/layout.tsx`)
   - `src/components/layout/DevOptions.tsx` ve `Nav.tsx`'teki `<DevOptions />` satırı, `src/lib/copyVersions.ts`
   - `src/app/karsilastir/` (farklar ve font sayfaları dahil), `src/components/dev/CompareView.tsx`, `DiffView.tsx`
     ve `FontCompare.tsx`, `src/fonts/legacy.ts`, `src/lib/textInventory.ts`, `src/lib/wordDiff.ts`, `globals.css`'teki
     `.cmp*`, `.dif*` ve `.fnt*` kuralları ve
     `src/proxy.ts`'teki `karsilastir` istisnası (`src/lib/siteTextKeys.ts` kalır, `npm run site-texts` kullanıyor)
   - `src/lib/members.ts` içindeki `Localized` tipinde sürüm anahtarları
   - `messages/en.json` ve `messages/tr.json` içindeki `nav.turkishOld` ve `nav.englishOld`
   - bu bölüm

## Hızlı harita

| Değiştirmek istediğin | Dosya | Nerede |
|---|---|---|
| Menü, footer, buton ve form yazıları, sayfa başlıkları | `messages/tr.json` | bölüm tablosuna bak ↓ |
| Anasayfadaki sayılar (DEPARTMAN, AKTİF ÜYE…) | `src/lib/constants.ts` | `HOME_STATS` → `label.tr` |
| Anasayfadaki departman kartları | `src/lib/constants.ts` | `HOME_DEPARTMENTS` → `desc.tr` |
| Hakkımızda'daki departman açıklamaları | `src/lib/constants.ts` | `ABOUT_DEPARTMENTS` → `purpose.tr`, `vision.tr` |
| Üye sayfaları (kısa tanıtım, biyografi, alıntı) | `src/data/members.json` | her üyede `tagline.tr`, `bio1.tr`, `bio2.tr`, `quote.tr` |
| Üye odak alanı etiketleri (Makine Öğrenmesi, İstatistik…) | `src/lib/skills.ts` | `SKILLS_TR`: İngilizce ad → Türkçe ad. Üyenin `focus` listesine sadece İngilizce adı yaz; sözlükte olmayan etiket build'i durdurur |
| Blog yazıları | `content/blog/tr/<slug>.mdx` | aşağıdaki "Blog" bölümüne bak |
| Arama motorlarına verilen kulüp adı (TR / EN) | `src/lib/seo.ts` | `SITE_NAME_TR` / `SITE_LEGAL_NAME` |
| Üye profilinin arama açıklaması ve unvanı | `messages/tr.json` / `en.json` | `metadata.member.description` ({name}: {tagline} + kulüp adı; 160 karakteri aşarsa kulüp adı düşer), `metadata.jobTitle.*`; 6 mesaj dosyasında da olmalı |
| Sosyal medya paylaşım görseli | `messages/tr.json` / `en.json` | `home.heroTitle` (büyük yazı) ve `brand.title`, `brand.university`; görsel `src/app/[locale]/opengraph-image.tsx` |
| İletişim formundan kulübe gelen e-posta | `src/lib/zoho.ts` | `sendContactMail` içindeki "Gönderen:", "Konu:"… |
| Mağaza sayfası yazıları (başlık, buton, WhatsApp mesajı) | `messages/tr.json` | `shop` |
| Mağaza ürünleri (ad, açıklama, fiyat, beden) | `src/lib/constants.ts` | `SHOP_PRODUCTS` → `name.tr`, `desc.tr`, `price`, `sizes` |
| Siparişlerin gideceği WhatsApp numarası | `src/lib/constants.ts` | `SHOP_WHATSAPP` |

## `messages/tr.json`: sitedeki yazıların çoğu

| Bölüm | Ne var |
|---|---|
| `metadata` | Tarayıcı sekmesindeki başlıklar ve Google'da görünen açıklamalar |
| `nav` | Üst menü, mobil menü |
| `brand` | Logonun yanındaki "Marmara Üniversitesi" |
| `footer` | Alt kısım: açıklama, link adları, telif satırı |
| `home` | Anasayfa |
| `about` | Hakkımızda |
| `team` | Ekip sayfası |
| `member` | Üye profil sayfasındaki etiketler |
| `blog` | Blog listesi ve yazı sayfasındaki etiketler |
| `contact` | İletişim sayfası, form etiketleri, hata ve başarı mesajları |
| `shop` | Mağaza sayfası: başlık, beden etiketi, sipariş butonu, WhatsApp'a giden hazır mesaj (`{product}` ve `{size}` yer tutucularına dokunma) |
| `roles` | BAŞKAN, DİREKTÖR… |
| `kpiLabels` | Üye sayfasındaki istatistik etiketleri (MAKALE, ETKİNLİK…) |
| `notFound` | 404 sayfası |

Kurallar:

- **Sadece sağ taraftaki değeri değiştir**, soldaki anahtarı (`"heroTitle"` gibi) değiştirme.
- `kpiLabels`'ta soldaki İngilizce kelimeler (`"ARTICLES"`) `members.json`'daki etiketlerle eşleşir. Onlara dokunma.
- `{name}` gibi süslü parantezli yer tutucuları olduğu gibi bırak; oraya kod isim yazar.
- Yeni bir anahtar eklersen aynısını `messages/en.json`'a da ekle, yoksa İngilizce sayfada metin yerine
  anahtarın adı (`home.yeniAnahtar` gibi) görünür.
- Dosya geçerli JSON olmalı: tırnaklar kapalı, satır sonlarında virgül doğru.

İngilizceyle aynı bırakılmış, gözden geçirilebilecek değerler:

- `team.vpHeading`: "VP"
- `metadata.defaultTitle`: "DSC Marmara · Data Science Club"

## `src/lib/constants.ts` ve `src/data/members.json`

Bu dosyalarda çevrilen alanlar `{ en: "…", tr: "…" }` şeklinde yan yana durur. Sadece `tr:` satırını düzenle.

```json
"tagline": { "en": "Leads the club's direction…", "tr": "Kulübün yönünü belirler…" }
```

## Blog

- Türkçe yazı, İngilizcesiyle **aynı dosya adıyla** `content/blog/tr/` içine konur. Örnek:
  `content/blog/en/ilk-yazi.mdx` ↔ `content/blog/tr/ilk-yazi.mdx`.
- Bir yazının Türkçesi yoksa Türkçe sitede İngilizcesi gösterilir. Sadece `tr/` içinde olan yazı yayınlanmaz.
- Çevrilecekler: üstteki `title`, `excerpt`, `readingTime` ("5 DK") alanları ve yazının kendisi.
- Değiştirilmeyecekler: `author`, `date`, `category`. Bunlar iki dilde de aynı kalır. `category` İngilizce
  departman adı olmalı, yoksa build hata verir.
- `author` bir üyenin slug'ıdır (`members.json`). Yazar ekipte değilse (veya ekipten ayrıldıysa) `author` yerine
  `authorName: "Ad Soyad"` yazılır. Ad profil linki, rol ve yazar kutusu olmadan görünür. Örnek: Mustafa Kaan
  Yıldız'ın risk analizi yazısı.
- Başlangıç için `content/blog/tr/_template.mdx` dosyasını kopyalayabilirsin.
- `draft: true` olan yazı yalnızca önizlemede görünür ("Taslak" uyarısıyla). Canlıda listede, sitemap'te ve yazarın
  profilinde yer almaz, adresi 404 verir. Yayınlamak için satırı silmek yeterli. Örnek:
  `evaluating-a-prediction-model` (şablonu denemek için yazılmış deneme yazısı).

**Yazının görünümü (okuma şablonu):**
- Başlık düz yazı fontuyla (Bricolage) çizilir; el yazısı font yalnızca sayfa hero'larında kalır.
- Üstte "kategori · tarih · süre", başlık ve yazar satırı bulunur. `excerpt`, yazının ilk paragrafında zaten geçmiyorsa
  başlığın altında özet olarak görünür.
- En az üç `##` / `###` başlık varsa içindekiler eklenir: geniş ekranda solda yapışkan, telefonda başlığın altında
  açılır kutu.
- Sonda yazar kutusu (yazar ekipteyse) ve "Diğer yazılar" listesi yer alır.
- Markdown: linkler, listeler, tablolar (GFM), dipnot `[^1]`, `satır içi kod`, kod blokları.
- Bileşenler: `<Callout>`, `<Figure>`, `<Chart>`, `<Metrics>`/`<Stat>`, `<Method>`, `<Grid>`, `<Details>`,
  `<Pipeline>`. Örnekleri `content/projects/<dil>/_template.mdx` dosyasında. Bileşenler `src/components/mdx/`,
  stilleri `globals.css` → `.article`.
- Görseller `public/` altına konur (`<Figure src="/blog/<slug>/x.png" …>`).

## Projeler (case study, şimdilik yalnızca önizleme)

- Proje sayfaları `content/projects/<dil>/<slug>.mdx` dosyalarından üretilir; kurallar blogla aynı (aynı slug iki
  dilde). Başlangıç için `content/projects/tr/_template.mdx` kullanılabilir; bütün bileşenlerin örnekleri orada.
- Frontmatter: `title`, `excerpt`, `category` (departman), `team` (üye slug'ları) ya da `teamNames`, `date`,
  `status` (`done` / `ongoing`), `stack`, `links` (`repo`, `demo`), `metrics` (üstteki metrik şeridi), `cover`
  (kart görseli), `featured` (anasayfada göster), `example` ("örnek sayfa" uyarısı).
- Sayfa düzeni:
  - `##` başlıklar numaralı bölüm (01 · SONUÇ), `###` başlıklar numaralı alt bölüm ([01]) olur.
  - Solda içindekiler, okuma çubuğu ve o an okunan bölüm vurgulanır.
  - Sayfa sonuçla açılmalı; yöntem sona kalmalı.
- **Grafikler:** `<Chart type="line|area|bar|scatter|histogram" …>` ile Plotly (`src/components/charts/`).
  - Veri satır içinde (`data={[…]}`) ya da `public/projects/<slug>/*.json` dosyasından (`src=`) gelir.
  - Plotly yalnızca grafik ekrana yaklaşınca, yalnızca o sayfada yüklenir.
- Örnek: `example-case-study` (uydurma veri, "örnek" uyarılı). Gerçek ilk proje gelince silinebilir; veri dosyaları
  `public/projects/example-case-study/`.
- **Şimdilik önizleme:**
  - `/projects` ve proje sayfaları canlıda 404 (`IS_PRODUCTION`). Anasayfadaki "Öne çıkan projeler" de canlıda
    gizli.
  - Önizlemede DEV OPTIONS → **Projeler →** ile açılır.
  - Metinleri (`projects.*`, `metadata.projects.*`) `SITE_METINLERI.md`'ye girmez.
- **Canlıya açmak için:**
  1. `src/app/[locale]/projects/page.tsx` ve `[slug]/page.tsx`'teki `if (IS_PRODUCTION) notFound()` satırlarını
     kaldır.
  2. `src/app/[locale]/page.tsx`'te `getFeaturedProjects`'i canlıda da çağır.
  3. `Nav.tsx` → `NAV_LINKS`'e `{ key: "projects", href: "/projects" }` ekle ve 6 mesaj dosyasına `nav.projects`
     yaz. Menü 880 px'te mobile geçiyor; 6. link sığıyor mu bak.
  4. `src/app/sitemap.ts`'e `/projects` ve proje sayfalarını ekle.
  5. `src/lib/siteTextKeys.ts`'ten `projects` satırını kaldır.
  6. Örnek vakayı sil.

## Türkçede de İngilizce kalanlar

Aşağıdakiler bilerek tek dilli bırakıldı. Türkçeleştirmek için kod değişikliği gerekir, metin düzenlemek yetmez:

- Departman adları (Data Insights, Core AI…) ve odak etiketleri (EDA, BI…)
- Üyelerin isimleri ve departman etiketi ("LEADERSHIP" gibi)
- Araç ve marka adı olan yetenek etiketleri (Python, SQL, Power BI, Notion…). Diğer etiketler Türkçe görünür; hepsi
  `src/lib/skills.ts`'teki tek sözlükte çevrilir (aşağıdaki "Hızlı harita"ya bak)
- Avatar kısaltması (`members.json` → `initials`): **adın her parçasından bir harf**. Üç parçalı adlarda üç harf
  (Ahmet Hamza Mülayim → AHM, Elif Ayşe Şen → EAŞ). Yeni üye eklerken de bu kurala uy.
- Footer'daki departman linkleri (`src/components/layout/Footer.tsx`)
- İletişim e-postasının konu başlığındaki `[İletişim]` etiketi. Inbox filtreleri buna bakıyor, değiştirme.
