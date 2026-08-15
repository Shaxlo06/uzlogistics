import { Radio } from "lucide-react";
import { ResearchLayout } from "@/components/research/ResearchLayout";

export const metadata = { title: "Real vaqt monitoring — uzlogisticsnet" };

export default function Page() {
  return (
    <ResearchLayout
      icon={Radio}
      color="#f59e0b"
      kicker="Real vaqt monitoring"
      title="Raqamli platforma orqali real vaqt monitoring"
      subtitle="Yuk tashish jarayonlarini uzluksiz kuzatish va ma'lumotlarni tezkor qayta ishlash imkonini beruvchi raqamli monitoring platformasi."
    >
      <h2>Texnologik yechim</h2>
      <p>
        Real vaqt monitoring platformasi transport vositalarining joylashuvi, yuk holati va tranzit
        jarayonlarining bosqichlari haqidagi ma&apos;lumotlarni uzluksiz oqim (streaming) rejimida qabul qiladi va
        qayta ishlaydi. Server-Sent Events (SSE) va WebSocket kabi zamonaviy uzatish protokollari orqali
        ma&apos;lumotlar foydalanuvchi interfeysida sekundlar ichida yangilanib boradi.
      </p>

      <h2>O&apos;lchangan samaradorlik</h2>
      <div className="stat-row">
        <div className="stat-box">
          <div className="value" style={{ color: "#f59e0b" }}>2.3x</div>
          <div className="label">Ma&apos;lumotlarni qayta ishlash tezligi oshishi</div>
        </div>
        <div className="stat-box">
          <div className="value" style={{ color: "#3b82f6" }}>2.8x</div>
          <div className="label">Monitoring aniqligi oshishi</div>
        </div>
      </div>
      <p>
        Ushbu ko&apos;rsatkichlar an&apos;anaviy (qo&apos;lda hisobot beriladigan) monitoring usullari bilan
        solishtirilganda erishilgan natijalardir: ma&apos;lumotlarni qayta ishlash tezligi 2.3 barobar, monitoring
        aniqligi esa 2.8 barobar oshgan.
      </p>

      <h2>Demo-platforma</h2>
      <p>
        Ushbu saytning{" "}
        <a className="text-brand-blue underline" href="/dashboard">
          real vaqt monitoring dashboard
        </a>{" "}
        bo&apos;limi ushbu ilmiy natijaning amaliy namoyishi hisoblanadi: unda faol yuklar, jonli xarita va KPI
        ko&apos;rsatkichlari simulyatsiya qilingan ma&apos;lumotlar asosida real vaqt rejimida yangilanib turadi.
        Ishlab chiqarish muhitida bu simulyatsiya haqiqiy GPS/IoT sensorlaridan kelayotgan ma&apos;lumotlar bilan
        almashtiriladi.
      </p>
    </ResearchLayout>
  );
}
