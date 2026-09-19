import { useEffect, useState } from 'react';
import ChipSelect from '../components/ChipSelect';
import { EXPERIENCE_OPTIONS } from '../data/options';
import { UI } from '../i18n/strings';
import { formatPeriod } from '../utils/formatPeriod';
import { transliterate } from '../utils/transliterate';
import { isPlausibleMonthValue, currentMonthValue, MIN_PERIOD_YEAR } from '../utils/period';
import { hapticImpact } from '../telegram';

const EMPTY_DRAFT = {
  company: '',
  city: '',
  periodFrom: '',
  periodTo: '',
  current: false,
  duties: []
};

const MIN_MONTH_VALUE = `${MIN_PERIOD_YEAR}-01`;

function JobEntryForm({ initial, onSave, onCancel }) {
  const t = UI.step2;
  const [draft, setDraft] = useState(initial || EMPTY_DRAFT);

  const missing = [];
  if (!draft.company.trim()) missing.push('назва компанії');
  if (!draft.periodFrom) {
    missing.push('початок роботи');
  } else if (!isPlausibleMonthValue(draft.periodFrom)) {
    missing.push('коректна дата початку роботи');
  }
  if (!draft.current) {
    if (!draft.periodTo) {
      missing.push('закінчення роботи (або позначте «Я досі тут працюю»)');
    } else if (!isPlausibleMonthValue(draft.periodTo)) {
      missing.push('коректна дата закінчення роботи');
    } else if (draft.periodFrom && draft.periodTo < draft.periodFrom) {
      missing.push('дата закінчення пізніше за дату початку');
    }
  }
  const valid = missing.length === 0;

  const toggleDuty = (option) => {
    setDraft((d) => {
      const exists = d.duties.some((item) => item.de === option.de);
      return {
        ...d,
        duties: exists ? d.duties.filter((i) => i.de !== option.de) : [...d.duties, option]
      };
    });
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-navy-900">{t.company}</span>
        <input
          type="text"
          value={draft.company}
          placeholder={t.companyPlaceholder}
          onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
          className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
        />
        {draft.company.trim() && (
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, company: transliterate(d.company) }))}
            className="mt-1 text-xs text-amber-700 underline underline-offset-2"
          >
            Транслітерувати: «{transliterate(draft.company)}»
          </button>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy-900">{t.city}</span>
        <input
          type="text"
          value={draft.city}
          placeholder={t.cityPlaceholder}
          onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
          className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
        />
        {draft.city.trim() && (
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, city: transliterate(d.city) }))}
            className="mt-1 text-xs text-amber-700 underline underline-offset-2"
          >
            Транслітерувати: «{transliterate(draft.city)}»
          </button>
        )}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium text-navy-900">{t.periodFrom}</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9-]*"
            placeholder="2020-06"
            maxLength="7"
            value={draft.periodFrom}
            onChange={(e) => {
              let val = e.target.value.replace(/[^\d-]/g, '');
              // Автоматично додаємо дефіс після 4 цифр
              if (val.length === 4 && !val.includes('-')) {
                val = val + '-';
              }
              // Валідація місяця (01-12)
              if (val.length === 7) {
                const month = parseInt(val.slice(5, 7));
                if (month > 12 || month < 1) {
                  return; // Не оновлюємо стан з невалідним місяцем
                }
              }
              setDraft((d) => ({ ...d, periodFrom: val }));
            }}
            className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-navy-900 outline-none focus:border-amber-600"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-navy-900">{t.periodTo}</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9-]*"
            placeholder="2023-12"
            maxLength="7"
            value={draft.periodTo}
            disabled={draft.current}
            onChange={(e) => {
              let val = e.target.value.replace(/[^\d-]/g, '');
              // Автоматично додаємо дефіс після 4 цифр
              if (val.length === 4 && !val.includes('-')) {
                val = val + '-';
              }
              // Валідація місяця (01-12)
              if (val.length === 7) {
                const month = parseInt(val.slice(5, 7));
                if (month > 12 || month < 1) {
                  return; // Не оновлюємо стан з невалідним місяцем
                }
              }
              setDraft((d) => ({ ...d, periodTo: val }));
            }}
            className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-navy-900 outline-none focus:border-amber-600 disabled:bg-navy-50 disabled:text-navy-400"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-navy-900">
        <input
          type="checkbox"
          checked={draft.current}
          onChange={(e) =>
            setDraft((d) => ({ ...d, current: e.target.checked, periodTo: e.target.checked ? '' : d.periodTo }))
          }
          className="h-4 w-4 rounded border-navy-100 accent-amber-600"
        />
        {t.currentJob}
      </label>

      <div>
        <p className="text-sm font-medium text-navy-900 mb-2">{t.duties}</p>
        <ChipSelect options={EXPERIENCE_OPTIONS} selected={draft.duties} onToggle={toggleDuty} />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-navy-100 px-4 py-2.5 text-sm font-medium text-navy-700"
        >
          {t.cancel}
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => {
            hapticImpact('medium');
            onSave(draft);
          }}
          className={[
            'flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors',
            valid ? 'bg-amber-600 hover:bg-amber-700' : 'bg-navy-100 text-navy-400 cursor-not-allowed'
          ].join(' ')}
        >
          {t.save}
        </button>
      </div>
      {!valid && (
        <p className="text-xs text-navy-400 -mt-2">Щоб зберегти, заповніть: {missing.join(', ')}.</p>
      )}
    </div>
  );
}

function JobEntryCard({ entry, onEdit, onDelete }) {
  const t = UI.step2;
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy-900">
            {entry.company}
            {entry.city ? `, ${entry.city}` : ''}
          </p>
          <p className="text-xs text-navy-400 mt-0.5">{formatPeriod(entry)}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={onEdit} className="text-xs text-amber-700 underline underline-offset-2">
            {t.edit}
          </button>
          <button type="button" onClick={onDelete} className="text-xs text-navy-400 underline underline-offset-2">
            {t.delete}
          </button>
        </div>
      </div>
      {entry.duties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {entry.duties.map((duty) => (
            <span key={duty.de} className="text-[11px] rounded-full bg-navy-50 px-2.5 py-1 text-navy-700">
              {duty.de}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Step2Experience({ entries, onAdd, onUpdate, onRemove, onFormOpenChange }) {
  const t = UI.step2;
  const [mode, setMode] = useState('list'); // 'list' | 'add' | `edit:${id}`

  useEffect(() => {
    onFormOpenChange?.(mode !== 'list');
  }, [mode, onFormOpenChange]);

  const editingEntry = mode.startsWith('edit:')
    ? entries.find((e) => e.id === mode.slice(5))
    : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-navy-900">{t.title}</h2>
        <p className="text-sm text-navy-400 mt-1">{t.hint}</p>
      </div>

      {mode === 'list' && (
        <>
          {entries.length === 0 && (
            <p className="text-sm text-navy-400 rounded-xl border border-dashed border-navy-100 px-4 py-6 text-center">
              {t.noJobs}
            </p>
          )}
          <div className="space-y-3">
            {entries.map((entry) => (
              <JobEntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => setMode(`edit:${entry.id}`)}
                onDelete={() => onRemove(entry.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setMode('add')}
            className="w-full rounded-xl border-2 border-dashed border-amber-300 px-4 py-3 text-sm font-medium text-amber-700 hover:border-amber-500"
          >
            + {t.addJob}
          </button>
        </>
      )}

      {mode === 'add' && (
        <JobEntryForm
          onSave={(draft) => {
            onAdd(draft);
            setMode('list');
          }}
          onCancel={() => setMode('list')}
        />
      )}

      {editingEntry && (
        <JobEntryForm
          initial={editingEntry}
          onSave={(draft) => {
            onUpdate(editingEntry.id, draft);
            setMode('list');
          }}
          onCancel={() => setMode('list')}
        />
      )}
    </div>
  );
}