# Türkçe metinler nerede?

Site İngilizce (`/`) ve Türkçe (`/tr`) yayınlanıyor. Türkçe metinleri elle düzeltmek için
aşağıdaki dosyalara bakman yeterli. Kod bilgisi gerekmiyor; sadece tırnak içindeki
**değerleri** değiştir.

Değişikliği görmek için: `npm run dev` → <http://localhost:3737/tr>

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

**Karşılaştırma:**
- Menünün altındaki **DEV OPTIONS** şeridinde **TR ESKİ | TR YENİ 1 | TR YENİ 2** ve İngilizcesi; aynı sayfada sürümler
  arasında geçilir.
- **Yan yana:** şeritteki **"Yan yana →"** ya da `/karsilastir` adresi. İki sürüm seçilir (ör. sol TR YENİ 2, sağ
  EN YENİ 2) ve aynı sayfa iki çerçevede açılır. Bir tarafta linke tıklanınca öbürü de aynı sayfaya gider; kaydırma
  eşlenir. Seçimler adreste durur (`?sol=…&sag=…&sayfa=…`), link paylaşılabilir.
- Şerit ve `/karsilastir` Vercel production'da (`NEXT_PUBLIC_VERCEL_ENV=production`) yok; sürüm adresleri canlıda 404.

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
`src/i18n/routing.ts` → `REVIEW_LOCALES` ve `src/lib/copyVersions.ts` → `COPY_VERSIONS`'tan çıkar.

**Yayın akışı:** geliştirme `preview-development` dalında yapılır; her push Vercel Preview'a gider. Yayına almak için
`git push origin preview-development:main` (ya da GitHub'da `preview-development` → `main` pull request'i). `main`'e
doğrudan commit atılmadığı sürece bu her seferinde çakışmasız bir fast-forward'dur. Mağaza, DEV OPTIONS, ESKİ sürümler
ve KPI'lar `main`'e geçse de canlıda kapalı kalır.

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
   - `src/app/karsilastir/`, `src/components/dev/CompareView.tsx`, `globals.css`'teki `.cmp*` kuralları ve
     `src/proxy.ts`'teki `karsilastir` istisnası
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
