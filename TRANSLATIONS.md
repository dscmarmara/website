# Türkçe metinler nerede?

Site İngilizce (`/`) ve Türkçe (`/tr`) yayınlanıyor. Türkçe metinleri elle düzeltmek için
aşağıdaki dosyalara bakman yeterli. Kod bilgisi gerekmiyor; sadece tırnak içindeki
**değerleri** değiştir.

Değişikliği görmek için: `npm run dev` → <http://localhost:3737/tr>

## Geçici: eski çeviri (TR ESKİ)

`/tr` artık **yeni çeviriyi** gösteriyor; düzenlenecek asıl Türkçe metin `messages/tr.json` ve `tr:` alanları.
Önceki çeviri karşılaştırma için `/tr-x-eski/...` adresinde saklanıyor (arama motorlarına kapalı).

Menüde tek dil düğmesi var (Türkçede "EN", İngilizcede "TR" → `/tr`). Menünün altındaki **DEV OPTIONS** şeridinde
**TR ESKİ** ve **TR YENİ** düğmeleriyle aynı sayfada iki çeviri arasında geçilir. Şerit Vercel'in production
ortamında (`NEXT_PUBLIC_VERCEL_ENV=production`) kendini gizler; preview'da ve lokalde görünür.

| | Arayüz metinleri | `constants.ts` alanları |
|---|---|---|
| TR YENİ (varsayılan, `/tr`) | `messages/tr.json` | `tr:` |
| TR ESKİ (`/tr-x-eski`) | `messages/tr-x-eski.json` | `"tr-x-eski":` (yalnızca farklı olan alanlarda; olmayan yerde `tr` kullanılır) |

`members.json` ve blog yazılarının ayrı bir "eski" sürümü yok; TR ESKİ'de de `tr` değerleri görünür.
Hakkımızda'daki Türkçe odak etiketleri `ABOUT_DEPARTMENTS[].focusByLocale.tr` içinde; TR ESKİ'de eskisi gibi
İngilizce `focus` etiketleri görünür.

**Açık notlar (karar bekliyor):**

- **Mağaza yer tutucularla duruyor, yayına almadan önce değiştir.** Hepsi `src/lib/constants.ts` içinde:
  - WhatsApp numarası `SHOP_WHATSAPP` sahte (`905555555555`).
  - Fiyatlar ve ürün açıklamaları `SHOP_PRODUCTS` içinde örnek değerler.
  - Ürün görselleri çizim (`src/components/shop/ProductArt.tsx`). Fotoğraflar gelince kartta `next/image` ile değiştirilir.

**Eski çeviriyi tamamen kaldırmak** (artık karşılaştırma gerekmediğinde; main'e merge etmeden önce önerilir):

1. `messages/tr-x-eski.json`'u sil.
2. `src/lib/constants.ts`'teki bütün `"tr-x-eski": "…"` satırlarını sil.
3. Kod tarafını kaldır:
   - `src/i18n/routing.ts` içindeki `REVIEW_LOCALE` ve onu kullanan yerler (`src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/[locale]/layout.tsx`)
   - `src/components/layout/DevOptions.tsx` ve `Nav.tsx`'teki `<DevOptions />` satırı
   - `src/lib/members.ts` içindeki `Localized` tipinde `"tr-x-eski"`
   - `messages/en.json` ve `messages/tr.json` içindeki `nav.turkishOld`
   - `about.orgSub` yalnızca `tr.json`'da var; İngilizce sayfada da görünsün istenirse `en.json`'a İngilizcesi eklenir
   - bu bölüm

## Hızlı harita

| Değiştirmek istediğin | Dosya | Nerede |
|---|---|---|
| Menü, footer, buton ve form yazıları, sayfa başlıkları | `messages/tr.json` | bölüm tablosuna bak ↓ |
| Anasayfadaki sayılar (DEPARTMAN, AKTİF ÜYE…) | `src/lib/constants.ts` | `HOME_STATS` → `label.tr` |
| Anasayfadaki departman kartları | `src/lib/constants.ts` | `HOME_DEPARTMENTS` → `desc.tr` |
| Hakkımızda'daki departman açıklamaları | `src/lib/constants.ts` | `ABOUT_DEPARTMENTS` → `purpose.tr`, `vision.tr` |
| Üye sayfaları (kısa tanıtım, biyografi, alıntı) | `src/data/members.json` | her üyede `tagline.tr`, `bio1.tr`, `bio2.tr`, `quote.tr` |
| Blog yazıları | `content/blog/tr/<slug>.mdx` | aşağıdaki "Blog" bölümüne bak |
| Arama motorlarına verilen Türkçe kulüp adı | `src/lib/seo.ts` | `SITE_NAME_TR` |
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
- Başlangıç için `content/blog/tr/_template.mdx` dosyasını kopyalayabilirsin.

## Türkçede de İngilizce kalanlar

Aşağıdakiler bilerek tek dilli bırakıldı. Türkçeleştirmek için kod değişikliği gerekir, metin düzenlemek yetmez:

- Departman adları (Data Insights, Core AI…) ve odak etiketleri (EDA, BI…)
- Üyelerin isimleri ve departman etiketi ("LEADERSHIP" gibi)
- Footer'daki departman linkleri (`src/components/layout/Footer.tsx`)
- Sosyal medya paylaşım görseli (`src/app/[locale]/opengraph-image.tsx`)
- İletişim e-postasının konu başlığındaki `[İletişim]` etiketi. Inbox filtreleri buna bakıyor, değiştirme.
