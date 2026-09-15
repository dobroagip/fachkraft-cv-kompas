import { useState } from 'react';
import { AT_COUNTRY_CODE, extractLocalPart, toFullAustrianPhone } from '../utils/phone';

// +43 показано як зафіксований, нередагований префікс зліва від поля —
// користувач вводить лише решту номера. Провідний "0" (0676...) і
// повторний код країни, якщо його все ж таки ввели, приберуться самі.
export default function PhoneField({ label, value, onChange }) {
  const [local, setLocal] = useState(() => extractLocalPart(value));

  const handleChange = (raw) => {
    const cleaned = raw.replace(/[^\d\s+]/g, '');
    setLocal(cleaned);
    onChange(toFullAustrianPhone(cleaned));
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <div className="mt-1.5 flex rounded-xl border border-navy-100 bg-white overflow-hidden focus-within:border-amber-600">
        <span className="flex items-center px-3 text-sm font-medium text-navy-700 bg-navy-50 border-r border-navy-100 select-none">
          {AT_COUNTRY_CODE}
        </span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={local}
          placeholder="676 1234567"
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 min-w-0 px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none"
        />
      </div>
    </label>
  );
}