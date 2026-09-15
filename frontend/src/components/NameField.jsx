import { useEffect, useState } from 'react';
import { transliterate, capitalizeWords } from '../utils/transliterate';

// Два поля одне під одним:
// 1) як людина звикла писати своє ім'я (кирилицею чи як завгодно);
// 2) латиницею — саме цей текст піде у Lebenslauf.
//
// Поле (2) автоматично підлаштовується під поле (1), ПОКИ людина сама
// його не відредагує — після цього автопідстановка вимикається, щоб не
// затирала ручні виправлення (наприклад, якщо офіційне написання в
// закордонному паспорті трохи відрізняється від автоматичної
// транслітерації).
export default function NameField({
  label,
  value,
  onChange,
  latinValue,
  onLatinChange,
  placeholder
}) {
  const suggestion = capitalizeWords(transliterate(value));
  const [touched, setTouched] = useState(Boolean(latinValue) && latinValue !== suggestion);

  useEffect(() => {
    if (!touched) onLatinChange(suggestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const resetToSuggestion = () => {
    setTouched(false);
    onLatinChange(suggestion);
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-navy-900">{label}</span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-amber-700">
          {label} латиницею — так буде надруковано в резюме
        </span>
        <input
  type="text"
  value={latinValue}
  onChange={(e) => {
    setTouched(true);
    onLatinChange(capitalizeWords(e.target.value));
  }}
  className="mt-1 w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3.5 py-2 text-navy-900 outline-none focus:border-amber-600"
/>
        {touched && suggestion && latinValue !== suggestion && (
          <button
            type="button"
            onClick={resetToSuggestion}
            className="mt-1 text-xs text-navy-400 underline underline-offset-2"
          >
            Повернути автоматичний варіант: «{suggestion}»
          </button>
        )}
      </label>
    </div>
  );
}