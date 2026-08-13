export const metadata = { title: "Loyiha haqida — UzLogistics" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy dark:text-white sm:text-4xl">
        Loyiha haqida
      </h1>
      <article className="prose-content mt-8">
        <h2>Maqsad</h2>
        <p>
          Ushbu platforma O&apos;zbekistonda logistika tizimlarini raqamli transformatsiyalash usullarini
          takomillashtirish va real vaqt monitoring tizimini ishlab chiqish bo&apos;yicha ilmiy-amaliy tadqiqot
          natijalarini namoyish etish uchun yaratilgan. Sayt ikki vazifani bajaradi: ilmiy/korporativ vitrina
          (4 ta ilmiy yangilik) va amaliy platforma (kompaniyalar katalogi va monitoring simulyatsiyasi).
        </p>

        <h2>Metodologiya</h2>
        <p>
          Tadqiqot Big Data tahlili, ekonometrik modellashtirish va real vaqt monitoring tizimlarini
          loyihalashtirish uslublaridan foydalangan holda olib borilgan. Kompaniyalar katalogi uchun ma&apos;lumotlar
          goldenpages.uz ochiq ma&apos;lumotlar bazasidan (jamoat telefon-справочник ma&apos;lumotlari) yig&apos;ilgan.
        </p>

        <h2>Manbalar</h2>
        <ul>
          <li>
            goldenpages.uz — &laquo;Логистические компании Узбекистана&raquo; rubrikasi (
            <a className="text-brand-blue underline" href="https://www.goldenpages.uz/rubrics/?Id=4676" target="_blank" rel="noopener noreferrer">
              havola
            </a>
            )
          </li>
          <li>Dissertatsiya tadqiqoti materiallari (4 ta ilmiy yangilik natijalari)</li>
        </ul>

        <h2>Muhim eslatma</h2>
        <p>
          Saytdagi barcha &laquo;real vaqt&raquo; ko&apos;rsatkichlari (jonli xarita, faol yuklar, KPI oqimi)
          ilmiy-demo/prototip maqsadida simulyatsiya qilingan. Ishlab chiqarish muhitida bu ma&apos;lumotlar haqiqiy
          GPS/IoT integratsiyasi bilan almashtiriladi.
        </p>
      </article>
    </div>
  );
}
