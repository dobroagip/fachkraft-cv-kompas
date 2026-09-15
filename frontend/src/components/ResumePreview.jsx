import { RESUME_SECTION_TITLES } from '../data/options';
import { formatPeriod } from '../utils/formatPeriod';
import { formatBirthDate } from '../utils/formatDate';
import { transliterate } from '../utils/transliterate';

function formatEduPeriod(entry) {
  if (!entry.periodFrom && !entry.periodTo && !entry.current) return '';
  const to = entry.current ? 'heute' : entry.periodTo || '';
  return [entry.periodFrom, to].filter(Boolean).join(' – ');
}

// ЗАХИСНА ТРАНСЛІТЕРАЦІЯ: навіть якщо користувач не натиснув кнопку
// "Транслітерувати" на кроках 1–2, тут ми все одно проганяємо ім'я,
// місто та назву компанії через transliterate(). Функція ідемпотентна —
// якщо текст уже латиницею, нічого не зміниться. Це гарантує, що в
// готовому Lebenslauf ніколи не залишиться кирилиці.

function MainSectionTitle({ children }) {
  return (
    <h3 className="text-[13px] font-bold uppercase tracking-wide text-navy-900 border-b-2 border-amber-600 pb-1 mb-2.5">
      {children}
    </h3>
  );
}

function SideSectionTitle({ children }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-wide text-navy-900 border-b border-navy-200 pb-1 mb-2">
      {children}
    </h3>
  );
}

function TagList({ items }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.de} className="text-[12px] text-navy-900">
          {item.de}
        </li>
      ))}
    </ul>
  );
}

export default function ResumePreview({ data }) {
  const { personal, experienceEntries, skills, certificates, languages, educationEntries } = data;

  const firstName = (personal.firstNameLatin || '').trim() || transliterate(personal.firstName) || 'Vorname';
const lastName = (personal.lastNameLatin || '').trim() || transliterate(personal.lastName) || 'Nachname';
  const city = transliterate(personal.city);
const address = [personal.postalCode, city].filter(Boolean).join(' ');

  const sortedEntries = [...experienceEntries].sort((a, b) =>
    (b.periodFrom || '').localeCompare(a.periodFrom || '')
  );

  return (
    <div
      id="cv-print-root"
      className="bg-white text-navy-900 mx-auto w-full max-w-[210mm] px-6 py-7 sm:px-10 sm:py-10 shadow-card sm:shadow-none rounded-lg sm:rounded-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Header — на всю ширину */}
      <div className="border-b border-navy-100 pb-4 mb-6">
        <h1 className="font-display leading-none">
          <span className="block text-[28px] font-light text-navy-700">{firstName}</span>
          <span className="block text-[32px] font-extrabold uppercase tracking-tight text-navy-900">
            {lastName}
          </span>
        </h1>
        <p className="text-[13px] text-amber-700 font-semibold mt-1.5">
          {RESUME_SECTION_TITLES.targetRole}
        </p>
      </div>

      {/* Дві колонки: зліва досвід/освіта (ширше), справа контакти/мови/навички */}
      <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-x-8 gap-y-6">
        {/* MAIN (2/3) */}
        <div className="sm:col-span-2 print:col-span-2 space-y-6 order-2 sm:order-1 print:order-1">
          {sortedEntries.length > 0 && (
            <section>
              <MainSectionTitle>{RESUME_SECTION_TITLES.experience}</MainSectionTitle>
              <div className="space-y-4">
                {sortedEntries.map((entry) => (
                  <div key={entry.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[13px] font-semibold text-navy-900">
                        {transliterate(entry.company)}
                        {entry.city ? `, ${transliterate(entry.city)}` : ''}
                      </p>
                      <p className="text-[11px] text-navy-400 shrink-0 whitespace-nowrap">
                        {formatPeriod(entry)}
                      </p>
                    </div>
                    {entry.duties.length > 0 && (
                      <ul className="list-disc list-inside mt-1">
                        {entry.duties.map((duty) => (
                          <li key={duty.de} className="text-[12.5px] text-navy-900 leading-snug">
                            {duty.de}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {educationEntries.length > 0 && (
  <section>
    <MainSectionTitle>{RESUME_SECTION_TITLES.education}</MainSectionTitle>
    <div className="space-y-3">
                     {[...educationEntries]
                  .sort((a, b) => (b.periodFrom || '').localeCompare(a.periodFrom || ''))
                  .map((entry) => {
                    const title = entry.specialty || entry.level?.de || '';
                    const showLevelLine = Boolean(entry.specialty && entry.level);
                    return (
                      <div key={entry.id}>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-[13px] font-semibold text-navy-900">{title}</p>
                          <p className="text-[11px] text-navy-400 shrink-0 whitespace-nowrap">
                            {formatEduPeriod(entry)}
                          </p>
                        </div>
                        {entry.institution && (
                          <p className="text-[12.5px] text-navy-900">{transliterate(entry.institution)}</p>
                        )}
                        {showLevelLine && (
                          <p className="text-[11px] text-navy-400 mt-0.5">{entry.level.de}</p>
                        )}
                      </div>
                    );
                  })}
    </div>
  </section>
)}
        </div>

        {/* SIDEBAR (1/3) */}
        <div className="sm:col-span-1 print:col-span-1 space-y-5 order-1 sm:order-2 print:order-2 sm:border-l sm:border-navy-100 sm:pl-6 print:border-l print:border-navy-100 print:pl-6">
          <section>
            <SideSectionTitle>{RESUME_SECTION_TITLES.personal}</SideSectionTitle>
            <div className="text-[12px] text-navy-900 space-y-0.5 leading-relaxed">
              {address && <div>{address}, Österreich</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.email && <div className="break-all">{personal.email}</div>}
              <div>Geburtsdatum: {formatBirthDate(personal.birthDate)}</div>
            </div>
          </section>

          <section>
            <SideSectionTitle>{RESUME_SECTION_TITLES.languages}</SideSectionTitle>
            <div className="text-[12px] text-navy-900 space-y-0.5">
              <div>Ukrainisch — Muttersprache</div>
              {languages.german && <div>Deutsch — {languages.german.de}</div>}
              {languages.english && <div>Englisch — {languages.english.de}</div>}
            </div>
          </section>

          {certificates.length > 0 && (
            <section>
              <SideSectionTitle>{RESUME_SECTION_TITLES.certificates}</SideSectionTitle>
              <TagList items={certificates} />
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SideSectionTitle>{RESUME_SECTION_TITLES.skills}</SideSectionTitle>
              <TagList items={skills} />
            </section>
          )}
        </div>
      </div>

      <div className="mt-8 pt-3 border-t border-navy-100 text-[10px] text-navy-400">
        Erstellt mit Fachkraft CV-Kompass
      </div>
    </div>
  );
}
