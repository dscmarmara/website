import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { REVIEW_LOCALE } from "@/i18n/routing";
import { PageHero } from "@/components/common/PageHero";
import { Reveal } from "@/components/effects/Reveal";
import { Eyebrow } from "@/components/common/Eyebrow";
import { DepartmentAccordions } from "@/components/about/DepartmentAccordions";

// TEMPORARY trial page, review locale only (/tr-x-yeni/odak-deneme): the new
// Turkish focus-area copy for the About accordions, laid out two ways so one
// can be picked. Once chosen, move that variant into ABOUT_DEPARTMENTS
// (lib/constants.ts) and delete this page.

export const metadata: Metadata = { title: "Odak alanları — deneme" };

/** A · the copy exactly as written. */
const FOCUS_TEXT: Record<string, string> = {
  "01": "Keşifçi Veri Analizi (EDA), veri temizleme, istatistiksel çıkarımlar, iş zekâsı (BI) süreçleri ve Tableau, Power BI, Matplotlib/Seaborn gibi araçlarla veri görselleştirme ve hikâyeleştirme.",
  "02": "Makine Öğrenmesi, Derin Öğrenme, Doğal Dil İşleme (NLP), Bilgisayarlı Görü (Computer Vision) ve Python (Scikit-Learn, TensorFlow, PyTorch).",
  "03": "Veri Mühendisliği, ETL (Extract-Transform-Load) süreçleri, büyük veri mimarileri (Hadoop, Spark), veri tabanı yönetimi (SQL, NoSQL), web scraping ve bulut sistemleri (AWS, Google Cloud).",
  "04": "Yıllık büyük zirvelerin (Summit) operasyonel planlaması, ödül geceleri (Awards) ile Datathon ve Hackathon'ların organizasyonel ve lojistik süreçlerinin yönetimi.",
  "05": "Sponsorluk dosyalarının hazırlanması, kurumsal şirket sunumları, bütçe planlaması, nakit akışı yönetimi, şirketlerle staj ve istihdam köprülerinin kurulması ve mezun ağının yönetimi.",
  "06": "Sosyal medya yönetimi (LinkedIn, Instagram, Medium vb.), grafik tasarım, marka kimliği ve kurumsal dil, video ve içerik üretimi, kriz iletişimi ve medya ilişkileri.",
};

/** B · the same copy split into chips. */
const FOCUS_TAGS: Record<string, string[]> = {
  "01": ["Keşifçi Veri Analizi (EDA)", "Veri temizleme", "İstatistiksel çıkarımlar", "İş zekâsı (BI)", "Veri görselleştirme", "Veri hikâyeleştirme", "Tableau", "Power BI", "Matplotlib / Seaborn"],
  "02": ["Makine Öğrenmesi", "Derin Öğrenme", "Doğal Dil İşleme (NLP)", "Bilgisayarlı Görü", "Python", "Scikit-Learn", "TensorFlow", "PyTorch"],
  "03": ["Veri Mühendisliği", "ETL süreçleri", "Büyük veri (Hadoop, Spark)", "Veri tabanı yönetimi (SQL, NoSQL)", "Web scraping", "Bulut (AWS, Google Cloud)"],
  "04": ["Zirve planlaması", "Ödül geceleri", "Datathon", "Hackathon", "Organizasyon ve lojistik"],
  "05": ["Sponsorluk dosyaları", "Kurumsal sunumlar", "Bütçe planlaması", "Nakit akışı yönetimi", "Staj ve istihdam köprüleri", "Mezun ağı"],
  "06": ["Sosyal medya yönetimi", "Grafik tasarım", "Marka kimliği ve kurumsal dil", "Video ve içerik üretimi", "Kriz iletişimi", "Medya ilişkileri"],
};

const VARIANTS = [
  { id: "a", eyebrow: "A · PARAGRAF", title: "Odak alanları metin olarak", focus: FOCUS_TEXT },
  { id: "b", eyebrow: "B · ETİKETLER", title: "Odak alanları etiket olarak", focus: FOCUS_TAGS },
];

const h2Style = {
  fontFamily: "var(--font-display-stack)",
  fontWeight: 700,
  fontSize: "clamp(28px,3.6vw,42px)",
  margin: 0,
} as const;

export default async function FocusTrialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== REVIEW_LOCALE) notFound();
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="DENEME"
        title="Odak alanları"
        sub="Hakkımızda sayfasındaki departman kartlarının iki hâli. Amaç ve vizyon metinleri ikisinde de aynı; sadece ortadaki Odak Alanları sütunu farklı."
        padding="96px 24px 64px"
      />
      {VARIANTS.map((v, i) => (
        <section key={v.id} style={{ borderTop: i ? "1px solid var(--border)" : undefined, background: i ? "var(--bg-elev)" : undefined }}>
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "80px 24px" }}>
            <Reveal style={{ marginBottom: 36 }}>
              <Eyebrow style={{ marginBottom: 12 }}>{v.eyebrow}</Eyebrow>
              <h2 style={h2Style}>{v.title}</h2>
            </Reveal>
            <DepartmentAccordions open focus={v.focus} />
          </div>
        </section>
      ))}
    </>
  );
}
