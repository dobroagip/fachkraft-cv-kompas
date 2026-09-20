import { useState } from 'react';

// ЧОМУ НЕ <input type="month">: на iOS Safari (і у вбудованому браузері
// Telegram на iPhone) це поле іноді показує лише цифрову клавіатуру без
// клавіші дефіса, хоча формат значення "YYYY-MM" вимагає дефіс — увести
// коректне значення фізично неможливо. Два звичайні числові поля
// працюють однаково надійно всюди.

function parseYearMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!match) return { year: '', month: '' };
  return { year: match[1], month: match[2] };
}

function toYearMonth({ year, month }) {
  if (!year || !month) return '';
  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}`;
}

export default function MonthYearField({ label, value, onChange, disabled 
= false }) {
  const initial = parseYearMonth(value);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  const update = (patch) => {
    const next = { month, year, ...patch };
    setMonth(next.month);
    setYear(next.year);
    onChange(toYearMonth(next));
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <input
          type="number"
          inputMode="numeric"
          placeholder="ММ"
          disabled={disabled}
          value={month}
          onChange={(e) => update({ month: e.target.value.replace(/\D/g, 
'').slice(0, 2) })}
          className="w-full rounded-xl border border-navy-100 bg-white 
px-3 py-2.5 text-center text-navy-900 placeholder:text-navy-400/60 
outline-none focus:border-amber-600 disabled:bg-navy-50 
disabled:text-navy-400"
        />
        <input
          type="number"
          inputMode="numeric"
          placeholder="РРРР"
          disabled={disabled}
          value={year}
          onChange={(e) => update({ year: e.target.value.replace(/\D/g, 
'').slice(0, 4) })}
          className="w-full rounded-xl border border-navy-100 bg-white 
px-3 py-2.5 text-center text-navy-900 placeholder:text-navy-400/60 
outline-none focus:border-amber-600 disabled:bg-navy-50 
disabled:text-navy-400"
        />
      </div>
    </label>
  );
}
