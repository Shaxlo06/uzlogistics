import { Database } from "lucide-react";
import { ResearchLayout } from "@/components/research/ResearchLayout";

export const metadata = { title: "Boshqaruv modeli — uzlogisticsnet" };

export default function Page() {
  return (
    <ResearchLayout
      icon={Database}
      color="#10b981"
      kicker="Boshqaruv modeli"
      title="Big Data va real vaqt monitoringga asoslangan boshqaruv modeli"
      subtitle="Katta hajmdagi logistika ma'lumotlarini real vaqt rejimida tahlil qilish orqali boshqaruv qarorlari sifatini oshirish modeli."
    >
      <h2>Model mohiyati</h2>
      <p>
        Ushbu ilmiy natija logistika kompaniyalari, transport vositalari va yuk oqimlaridan kelayotgan katta
        hajmdagi (Big Data) ma&apos;lumotlarni real vaqt monitoring tizimi orqali qayta ishlash va boshqaruv
        qarorlarini avtomatlashtirish modelini taqdim etadi. Model logistika zanjiridagi barcha ishtirokchilarni
        (yuk yuboruvchi, tashuvchi, bojxona, qabul qiluvchi) yagona raqamli makonga birlashtiradi.
      </p>

      <h2>Miqdoriy samaradorlik ko&apos;rsatkichlari</h2>
      <p>Modelni O&apos;zbekiston logistika kompaniyalari misolida sinovdan o&apos;tkazish natijalari:</p>
      <div className="stat-row">
        <div className="stat-box">
          <div className="value" style={{ color: "#10b981" }}>-8...-10%</div>
          <div className="label">Logistika xarajatlari kamayishi</div>
        </div>
        <div className="stat-box">
          <div className="value" style={{ color: "#3b82f6" }}>+12%</div>
          <div className="label">Yetkazib berish tezligi oshishi</div>
        </div>
        <div className="stat-box">
          <div className="value" style={{ color: "#8b5cf6" }}>+15%</div>
          <div className="label">Tranzit jarayonlari samaradorligi</div>
        </div>
      </div>

      <h2>Boshqaruv mexanizmi</h2>
      <p>
        Model real vaqt ma&apos;lumotlarini KPI ko&apos;rsatkichlariga aylantiradi va bu ko&apos;rsatkichlar asosida
        avtomatik ogohlantirishlar generatsiya qilinadi: yo&apos;lda kechikish, bojxonada to&apos;xtalib qolish yoki
        marshrutdan chetlanish holatlari aniqlanganda tizim mas&apos;ul shaxslarga signal beradi. Bu esa
        operativ qarorlar qabul qilish imkonini yaratadi va umumiy logistika samaradorligini oshiradi.
      </p>

      <h2>Amaliy tatbiq</h2>
      <p>
        Ushbu platformaning <a className="text-brand-blue underline" href="/dashboard">Monitoring dashboard</a>{" "}
        bo&apos;limida yuqoridagi barcha ko&apos;rsatkichlar jonli (simulyatsiya qilingan) rejimda vizuallashtirilgan.
      </p>
    </ResearchLayout>
  );
}
