import { TrendingUp } from "lucide-react";
import { ResearchLayout } from "@/components/research/ResearchLayout";

export const metadata = { title: "2030 prognozi — UzLogistics" };

export default function Page() {
  return (
    <ResearchLayout
      icon={TrendingUp}
      color="#8b5cf6"
      kicker="2030 prognozi"
      title="Ekonometrik modellashtirish asosida 2030-yilgacha prognoz"
      subtitle="Logistika samaradorligi indeksining kelgusi yillardagi dinamikasini baholovchi ekonometrik model."
    >
      <h2>Prognoz modeli</h2>
      <p>
        To&apos;rtinchi ilmiy natija sifatida, logistika samaradorligi indeksining 2030-yilgacha bo&apos;lgan
        dinamikasi ekonometrik modellashtirish asosida baholangan. Modelga YIM o&apos;sish sur&apos;ati,
        raqamlashtirish darajasi (ICT-indeks) va xalqaro tranzit yuk hajmi kabi asosiy omillar regressorlar
        sifatida kiritilgan.
      </p>

      <h2>Asosiy natijalar</h2>
      <p>
        Asosiy grafik O&apos;zbekiston Milliy statistika qo&apos;mitasining rasmiy 2014-2026-yillik &quot;H —
        Tashish va saqlash&quot; bo&apos;limi bo&apos;yicha ro&apos;yxatdan o&apos;tgan korxonalar soniga
        (IFUT-2, kod 1.09.02.0220) asoslanadi; 2027-2030 yillar so&apos;nggi uch yillik o&apos;rtacha o&apos;sish
        sur&apos;atidan konservativ ekstrapolyatsiya qilingan. Qo&apos;shimcha, sintetik &quot;logistika
        samaradorligi indeksi&quot; (0-100 shkala) LX/YT/TS va 2.3x/2.8x natijalarini birlashtirgan
        modellashtirilgan ko&apos;rsatkich sifatida alohida keltiriladi. To&apos;liq interaktiv grafiklar va
        metodologiya tavsifi{" "}
        <a className="text-brand-blue underline" href="/analytics/forecast">
          Prognoz sahifasida
        </a>{" "}
        keltirilgan.
      </p>

      <h2>Amaliy ahamiyati</h2>
      <p>
        Ushbu prognoz davlat organlari va xususiy logistika operatorlari uchun strategik rejalashtirish
        vositasi bo&apos;lib xizmat qiladi — infratuzilma investitsiyalari, raqamlashtirish dasturlari va
        transchegaraviy hamkorlik yo&apos;nalishlarini belgilashda foydalanish mumkin.
      </p>
    </ResearchLayout>
  );
}
