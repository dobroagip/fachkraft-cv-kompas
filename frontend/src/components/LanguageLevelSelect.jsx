import { LANGUAGE_LEVELS } from '../data/options';
import { hapticImpact } from '../telegram';

export default function LanguageLevelSelect({ label, value, onChange, allowNone = false, noneLabel }) {
  return (
    <div>
      <p className="text-sm font-medium text-navy-900 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {allowNone && (
          <button
            type="button"
            onClick={() => {
              hapticImpact('light');
              onChange(null);
            }}
            className={[
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              value === null
                ? 'border-navy-700 bg-navy-700 text-white'
                : 'border-navy-100 bg-white text-navy-400'
            ].join(' ')}
          >
            {noneLabel}
          </button>
        )}
        {LANGUAGE_LEVELS.map((level) => {
          const active = value?.de === level.de;
          return (
            <button
              key={level.de}
              type="button"
              onClick={() => {
                hapticImpact('light');
                onChange(level);
              }}
              className={[
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                active
                  ? 'border-amber-600 bg-amber-600 text-white'
                  : 'border-navy-100 bg-white text-navy-700 hover:border-amber-400'
              ].join(' ')}
            >
              {level.de}
            </button>
          );
        })}
      </div>
    </div>
  );
}
