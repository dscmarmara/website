# Türkçe metinler nerede?

Site İngilizce (`/`) ve Türkçe (`/tr`) yayınlanıyor. Türkçe metinleri elle düzeltmek için
aşağıdaki dosyalara bakman yeterli. Kod bilgisi gerekmiyor; sadece tırnak içindeki
**değerleri** değiştir.

Değişikliği görmek için: `npm run dev` → <http://localhost:3737/tr>

## Geçici: eski metinler (TR ESKİ / EN ESKİ)

`/tr` ve `/` artık **yeni metinleri** gösteriyor; düzenlenecek asıl metinler `messages/tr.json` / `messages/en.json`
ve `tr:` / `en:` alanları. Önceki metinler karşılaştırma için `/tr-x-eski/...` ve `/en-x-eski/...` adreslerinde
saklanıyor (arama motorlarına kapalı).

Menüde tek dil düğmesi var (Türkçede "EN" → `/`, İngilizcede "TR" → `/tr`). Menünün altındaki **DEV OPTIONS**
şeridinde **TR ESKİ | TR YENİ** ve **EN ESKİ | EN YENİ** düğmeleriyle aynı sayfada eski ve yeni metin arasında
geçilir. Şerit Vercel'in production ortamında (`NEXT_PUBLIC_VERCEL_ENV=production`) kendini gizler; preview'da ve
lokalde görünür.

| | Arayüz metinleri | `constants.ts` alanları |
|---|---|---|
| TR YENİ (varsayılan, `/tr`) | `messages/tr.json` | `tr:` |
| TR ESKİ (`/tr-x-eski`) | `messages/tr-x-eski.json` | `"tr-x-eski":` (yalnızca farklı olan alanlarda; olmayan yerde `tr` kullanılır) |
| EN YENİ (varsayılan, `/`) | `messages/en.json` | `en:` |
| EN ESKİ (`/en-x-eski`) | `messages/en-x-eski.json` | `"en-x-eski":` (aynı şekilde; şu an hiçbir alanda farklı değil) |

Bir metni değiştirirken eskisini karşılaştırmada tutmak istersen: mesaj dosyalarında yeni metni sadece `tr.json` /
`en.json`'a yaz (ESKİ dosyalar olduğu gibi kalır); `constants.ts` / `members.json`'da eski değeri `"tr-x-eski"` /
`"en-x-eski"` anahtarına taşı.

`members.json` ve blog yazılarının ayrı bir "eski" sürümü yok; ESKİ sayfalarda da `tr` / `en` değerleri görünür.
Hakkımızda'daki Türkçe odak etiketleri `ABOUT_DEPARTMENTS[].focusByLocale.tr` içinde; TR ESKİ'de eskisi gibi
İngilizce `focus` etiketleri görünür.

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
  (örn. "16 DASHBOARDS") ama gösterilmiyor; profil sayfasındaki şerit boş bir ayırıcı olarak kalıyor. Gerçek rakamlar
  girilince `src/app/[locale]/team/[slug]/page.tsx`'teki `SHOW_KPIS`'i `true` yap.
- **Kendi metnini vermemiş üyelerde sade rol metni var** (ör. "Emirhan, Data Insights departmanını birlikte yönetiyor.").
  Eski placeholder metinleri `"tr-x-eski"` / `"en-x-eski"` anahtarlarında, ESKİ sürümlerde görünür. Üye kendi metnini
  gönderince `tr` / `en` değerlerine yazılır.

**Eski metinleri tamamen kaldırmak** (artık karşılaştırma gerekmediğinde; main'e merge etmeden önce önerilir):

1. `messages/tr-x-eski.json` ve `messages/en-x-eski.json`'u sil.
2. `src/lib/constants.ts` ve `src/data/members.json`'daki bütün `"tr-x-eski"` / `"en-x-eski"` satırlarını sil.
3. Kod tarafını kaldır:
   - `src/i18n/routing.ts` içindeki `REVIEW_LOCALES` / `isReviewLocale` ve onları kullanan yerler (`src/lib/seo.ts`, `src/app/[locale]/layout.tsx`)
   - `src/components/layout/DevOptions.tsx` ve `Nav.tsx`'teki `<DevOptions />` satırı
   - `src/lib/members.ts` içindeki `Localized` tipinde `"tr-x-eski"` ve `"en-x-eski"`
   - `messages/en.json` ve `messages/tr.json` içindeki `nav.turkishOld` ve `nav.englishOld`
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
- Üye sayfasındaki yetenek etiketleri (`members.json` → `focus`) düz metinse iki dilde aynı görünür; bir etiketi
  `{ "en": "Accounting", "tr": "Muhasebe" }` şeklinde yazarsan dile göre görünür
- Footer'daki departman linkleri (`src/components/layout/Footer.tsx`)
- Sosyal medya paylaşım görseli (`src/app/[locale]/opengraph-image.tsx`)
- İletişim e-postasının konu başlığındaki `[İletişim]` etiketi. Inbox filtreleri buna bakıyor, değiştirme.
