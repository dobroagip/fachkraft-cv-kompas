import { UI } from '../i18n/strings';
import { transliterate } from '../utils/transliterate';
import {
  sanitizePostalCode,
  stripCyrillic,
  isPlausibleCityName,
  suggestCityForPostalCode
} from '../utils/address';
import { isPlausibleBirthDate } from '../utils/formatDate';
import PhoneField from '../components/PhoneField';
import NameField from '../components/NameField';

const MIN_BIRTH_DATE = '1940-01-01';
const MAX_BIRTH_DATE = new Date().toISOString().slice(0, 10);

function Field({ label, placeholder, value, onChange, type = 'text', required = true, min, max, transliteratable = false }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
      />
      {transliteratable && value.trim() && (
        <button
          type="button"
          onClick={() => onChange(transliterate(value))}
          className="mt-1 text-xs text-amber-700 underline underline-offset-2"
        >
          Транслітерувати латиницею: «{transliterate(value)}»
        </button>
      )}
    </label>
  );
}

export default function Step1Personal({ personal, updatePersonal }) {
  const t = UI.step1;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-navy-900">{t.title}</h2>
        <p className="text-sm text-navy-400 mt-1">{t.hint}</p>
      </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-2.5 text-xs text-navy-700">
        Німецькі роботодавці не читають кирилицю. Ім’я, прізвище та місто
        мають бути латиницею — так само, як у закордонному паспорті.
        Натисніть «Транслітерувати», щоб перевести написане автоматично.
      </div>
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-navy-700">
        🔒 {UI.privacyNotice}
      </div>
      <div className="grid grid-cols-1 gap-4">
        <NameField
          label={t.firstName}
          placeholder={t.firstNamePlaceholder}
          value={personal.firstName}
          onChange={(v) => updatePersonal('firstName', v)}
          latinValue={personal.firstNameLatin}
          onLatinChange={(v) => updatePersonal('firstNameLatin', v)}
        />
        <NameField
          label={t.lastName}
          placeholder={t.lastNamePlaceholder}
          value={personal.lastName}
          onChange={(v) => updatePersonal('lastName', v)}
          latinValue={personal.lastNameLatin}
          onLatinChange={(v) => updatePersonal('lastNameLatin', v)}
        />
        <Field
          label={t.birthDate}
          type="date"
          min={MIN_BIRTH_DATE}
          max={MAX_BIRTH_DATE}
          value={personal.birthDate}
          onChange={(v) => updatePersonal('birthDate', v)}
        />
        {personal.birthDate && !isPlausibleBirthDate(personal.birthDate) && (
          <p className="text-xs text-red-600 -mt-3">
            Перевірте рік народження — здається, він введений некоректно.
          </p>
        )}
        <Field
          label={t.postalCode}
          placeholder={t.postalCodePlaceholder}
          type="text"
          value={personal.postalCode}
          onChange={(v) => updatePersonal('postalCode', sanitizePostalCode(v))}
        />
        <p className="text-xs text-navy-400 -mt-3">{t.postalCodeHint}</p>
        <Field
          label={t.city}
          placeholder={t.cityPlaceholder}
          value={personal.city}
          onChange={(v) => updatePersonal('city', stripCyrillic(v))}
        />
        <p className="text-xs text-navy-400 -mt-3">{t.cityHint}</p>
        {personal.city.trim() && !isPlausibleCityName(personal.city) && (
          <p className="text-xs text-red-600 -mt-3">
            Назва населеного пункту виглядає некоректно — перевірте, будь ласка.
          </p>
        )}
        {(() => {
          const suggested = suggestCityForPostalCode(personal.postalCode);
          if (!suggested || suggested === personal.city.trim()) return null;
          return (
            <button
              type="button"
              onClick={() => updatePersonal('city', suggested)}
              className="text-xs text-amber-700 underline underline-offset-2 -mt-3 text-left"
            >
              Для індексу {personal.postalCode} зазвичай пишуть «{suggested}» — підставити?
            </button>
          );
        })()}
                <PhoneField label={t.phone} value={personal.phone} onChange={(v) => updatePersonal('phone', v)} />
        <Field label={t.email} placeholder={t.emailPlaceholder} type="email" value={personal.email} onChange={(v) => updatePersonal('email', v)} />
      </div>
      {(() => {
        const missing = getStep1MissingFields(personal);
        if (missing.length === 0) return null;
        return (
          <p className="text-xs text-navy-400">
            Щоб перейти далі, заповніть: {missing.join(', ')}.
          </p>
        );
      })()}
    </div>
  );
}

export function getStep1MissingFields(personal) {
  const missing = [];
  if (!personal.firstName.trim()) missing.push("ім'я");
  if (!personal.lastName.trim()) missing.push('прізвище');
  if (!isPlausibleBirthDate(personal.birthDate)) missing.push('коректна дата народження');
  if (!/^\d{4}$/.test(personal.postalCode)) missing.push('поштовий індекс (4 цифри)');
  if (!isPlausibleCityName(personal.city)) missing.push('коректний населений пункт (латиницею)');
  if (!personal.phone.trim()) missing.push('телефон');
  if (!personal.email.trim()) missing.push('email');
  return missing;
}

export function isStep1Valid(personal) {
  return getStep1MissingFields(personal).length === 0;
}