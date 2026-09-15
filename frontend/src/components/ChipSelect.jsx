import { hapticImpact } from '../telegram';

// Мультивибір у вигляді "чипів". Показуємо українську назву як основний
// текст і німецький термін дрібним підписом — щоб людина одразу
// запам'ятовувала, як це слово виглядатиме у резюме.
export default function ChipSelect({ options, selected, onToggle, single = false }) {
  const isSelected = (option) => {
    if (single) return selected?.de === option.de;
    return (selected || []).some((item) => item.de === option.de);
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const active = isSelected(option);
        return (
          <button
            key={option.de}
            type="button"
            onClick={() => {
              hapticImpact('light');
              onToggle(option);
            }}
            aria-pressed={active}
            className={[
              'group flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-all duration-150',
              active
                ? 'border-amber-600 bg-amber-50 shadow-card'
                : 'border-navy-100 bg-white hover:border-amber-400'
            ].join(' ')}
          >
            <span
              className={[
                'text-sm font-medium leading-tight',
                active ? 'text-navy-900' : 'text-navy-700'
              ].join(' ')}
            >
              {option.ua}
            </span>
            <span className="text-xs text-navy-400/70 mt-0.5">{option.de}</span>
          </button>
        );
      })}
    </div>
  );
}
