import { Cpu } from "lucide-react";
import { ResearchLayout } from "@/components/research/ResearchLayout";

export const metadata = { title: "Raqamli transformatsiya — uzlogisticsnet" };

export default function Page() {
  return (
    <ResearchLayout
      icon={Cpu}
      color="#3b82f6"
      kicker="Raqamli transformatsiya"
      title="Logistika tizimlarini raqamli transformatsiyalash modeli"
      subtitle="Transport-logistika jarayonlariga raqamli texnologiyalar integratsiyasi orqali samaradorlikni oshirish uslubiy-tushunchaviy modeli."
    >
      <h2>Muammoning dolzarbligi</h2>
      <p>
        O&apos;zbekiston iqtisodiyotining tranzit salohiyati va eksport-import operatsiyalari hajmining o&apos;sishi
        logistika tizimlarini yangi sifat bosqichiga olib chiqishni talab qilmoqda. An&apos;anaviy logistika
        jarayonlari — qog&apos;ozbozlik, hujjat almashinuvidagi kechikishlar, transport vositalari holati haqida
        real vaqt ma&apos;lumotining yo&apos;qligi — xarajatlarning oshishiga va yetkazib berish muddatlarining
        cho&apos;zilishiga olib kelmoqda. Ushbu tadqiqot transport-logistika jarayonlariga raqamli texnologiyalarni
        (IoT, Big Data, bulutli hisoblash, avtomatlashtirilgan boshqaruv tizimlari) integratsiya qilishning
        uslubiy-tushunchaviy modelini taklif etadi.
      </p>

      <h2>Model tuzilishi</h2>
      <p>
        Taklif etilayotgan model uchta o&apos;zaro bog&apos;liq qatlamdan iborat:
      </p>
      <ul>
        <li>
          <strong>Ma&apos;lumot yig&apos;ish qatlami</strong> — transport vositalari, ombor va bojxona nazorat-o&apos;tkazish
          punktlaridan sensorlar va raqamli hujjat aylanishi orqali ma&apos;lumot to&apos;plash;
        </li>
        <li>
          <strong>Qayta ishlash va tahlil qatlami</strong> — Big Data infratuzilmasi asosida ma&apos;lumotlarni
          agregatsiyalash, anomaliyalarni aniqlash va prognozlashtirish;
        </li>
        <li>
          <strong>Qaror qabul qilish qatlami</strong> — menejerlar va davlat organlari uchun boshqaruv qarorlarini
          qo&apos;llab-quvvatlovchi dashboard va bildirishnoma tizimlari.
        </li>
      </ul>

      <h2>Kutilayotgan samara</h2>
      <p>
        Modelning amaliy qo&apos;llanilishi transport-logistika jarayonlarining shaffofligini oshiradi, qaror qabul
        qilish tezligini tezlashtiradi va xarajatlarni optimallashtiradi. Ushbu model keyingi ilmiy yangiliklar
        (Big Data boshqaruv modeli va real vaqt monitoring platformasi) uchun nazariy asos bo&apos;lib xizmat qiladi.
      </p>
    </ResearchLayout>
  );
}
