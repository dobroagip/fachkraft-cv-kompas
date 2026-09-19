import { useEffect, useState } from 'react';
import ChipSelect from '../components/ChipSelect';
import { EDUCATION_OPTIONS, SPECIALTY_OPTIONS } from '../data/options';
import { UI } from '../i18n/strings';
import { transliterate } from '../utils/transliterate';
import { stripCyrillic, isPlausibleLatinPhrase } from '../utils/address';
import { isPlausibleYear, getCurrentYear, MIN_PERIOD_YEAR } from '../utils/period';
import { hapticImpact } from '../telegram';

const EMPTY_DRAFT = {
  institution: '',
  specialty: '',
  level: null,
  periodFrom: '',
  periodTo: '',
  current: false
};

function formatEduPeriod(entry) {
  if (!entry.periodFrom && !entry.periodTo && !entry.current) return '';
  const to = entry.current ? 'дотепер' : entry.periodTo || '';
  return [entry.periodFrom, to].filter(Boolean).join(' – ');
}

function TransliterateInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
      />
      {value.trim() && (
        <button
          type="button"
          onClick={() => onChange(transliterate(value))}
          className="mt-1 text-xs text-amber-700 underline underline-offset-2"
        >
          Транслітерувати: «{transliterate(value)}»
        </button>
      )}
    </label>
  );
}
function SpecialtySelect({ value, onChange }) {
  const t = UI.step6;
  const isKnownOption = SPECIALTY_OPTIONS.some((o) => o.de === value);
  const [mode, setMode] = useState(value && !isKnownOption ? 'manual' : 'list');
  const [query, setQuery] = useState('');

  const matches = (
    query.trim()
      ? SPECIALTY_OPTIONS.filter((o) => o.ua.toLowerCase().includes(query.trim().toLowerCase()))
      : SPECIALTY_OPTIONS
  ).slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-navy-900">{t.specialty}</span>
        <div className="flex rounded-lg border border-navy-100 overflow-hidden text-[11px]">
          <button
            type="button"
            onClick={() => setMode('list')}
            className={`px-2.5 py-1 ${mode === 'list' ? 'bg-amber-600 text-white' : 'bg-white text-navy-500'}`}
          >
            Зі списку
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-2.5 py-1 ${mode === 'manual' ? 'bg-amber-600 text-white' : 'bg-white text-navy-500'}`}
          >
            Вручну
          </button>
        </div>
      </div>

      {mode === 'list' ? (
        <>
          {value && isKnownOption ? (
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5">
              <span className="text-sm text-navy-900">
                {SPECIALTY_OPTIONS.find((o) => o.de === value)?.ua} — <b>{value}</b>
              </span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs text-amber-700 underline underline-offset-2 shrink-0 ml-2"
              >
                {t.changeSpecialty}
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.specialtySearchPlaceholder}
                className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {matches.map((o) => (
                  <button
                    key={o.de}
                    type="button"
                    onClick={() => onChange(o.de)}
                    className="rounded-full border border-navy-100 bg-white px-3 py-1.5 text-xs text-navy-700 hover:border-amber-400"
                  >
                    {o.ua} <span className="text-navy-400">· {o.de}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
                    <input
            type="text"
            value={value}
            onChange={(e) => onChange(stripCyrillic(e.target.value))}
            placeholder={t.specialtyManualPlaceholder}
            className="mt-1.5 w-full rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400/60 outline-none focus:border-amber-600"
          />
          <p className="mt-1 text-xs text-navy-400">{t.specialtyManualHint}</p>
          {value.trim() && !isPlausibleLatinPhrase(value) && (
            <p className="mt-1 text-xs text-red-600">
              Схоже на помилку — залиште лише літери (наприклад: Bäcker, Schweißer).
            </p>
          )}
          <p className="mt-1 text-xs text-navy-400">{t.specialtyManualHint}</p>
        </>
      )}
    </div>
  );
}
function EducationEntryForm({ initial, onSave, onCancel }) {
  const t = UI.step6;
  const [draft, setDraft] = useState(initial || EMPTY_DRAFT);

  const isBasicSchool = draft.level?.de === 'Pflichtschulabschluss';

  const missing = [];
  if (!draft.level) missing.push('рівень освіти');
  if (!isBasicSchool) {
    if (!draft.institution.trim()) missing.push('заклад освіти');
    if (!draft.specialty.trim()) {
      missing.push('спеціальність (оберіть зі списку або впишіть вручну)');
    } else if (!isPlausibleLatinPhrase(draft.specialty)) {
      missing.push('коректна назва спеціальності (тільки латиниця, без цифр)');
    }
  }
  if (!draft.periodFrom) {
    missing.push('рік початку навчання');
  } else if (!isPlausibleYear(draft.periodFrom)) {
    missing.push(`правильний рік початку (від ${MIN_PERIOD_YEAR} до ${getCurrentYear()})`);
  }
  if (!draft.current && draft.periodTo) {
    if (!isPlausibleYear(draft.periodTo)) {
      missing.push(`правильний рік завершення (від ${MIN_PERIOD_YEAR} до ${getCurrentYear()})`);
    } else if (Number(draft.periodTo) < Number(draft.periodFrom)) {
      missing.push('рік завершення пізніше за рік початку');
    }
  }
  const valid = missing.length === 0;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-4">
      <div>
        <p className="text-sm font-medium text-navy-900 mb-2">{t.level}</p>
        <ChipSelect
          options={EDUCATION_OPTIONS}
          selected={draft.level}
          single
          onToggle={(option) =>
            setDraft((d) => ({
              ...d,
              level: option,
              // Базова школа не має "спеціальності" — очищаємо поле,
              // щоб воно не потрапило в резюме, якщо людина передумає.
              specialty: option.de === 'Pflichtschulabschluss' ? '' : d.specialty
            }))
          }
        />
      </div>

      {draft.level && (
        <>
          <TransliterateInput
            label={isBasicSchool ? t.institutionSchool : t.institution}
            placeholder={t.institutionPlaceholder}
            value={draft.institution}
            onChange={(v) => setDraft((d) => ({ ...d, institution: v }))}
          />

          {!isBasicSchool && (
            <SpecialtySelect
              value={draft.specialty}
              onChange={(v) => setDraft((d) => ({ ...d, specialty: v }))}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-navy-900">{t.periodFrom}</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="2018"
                maxLength="4"
                value={draft.periodFrom}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
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
                pattern="[0-9]*"
                placeholder="2022"
                maxLength="4"
                value={draft.periodTo}
                disabled={draft.current}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
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
            {t.currentStudy}
          </label>
        </>
      )}

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
        <p className="text-xs text-navy-400 -mt-2">
          Щоб зберегти, заповніть: {missing.join(', ')}.
        </p>
      )}
    </div>
  );
}

function EducationEntryCard({ entry, onEdit, onDelete }) {
  const t = UI.step6;
  const title = entry.specialty || entry.level?.de || '—';
  const showLevelTag = Boolean(entry.specialty && entry.level);
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy-900">{title}</p>
          {entry.institution && <p className="text-xs text-navy-700 mt-0.5">{entry.institution}</p>}
          <p className="text-xs text-navy-400 mt-0.5">{formatEduPeriod(entry)}</p>
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
      {showLevelTag && (
        <span className="inline-block mt-2 text-[11px] rounded-full bg-navy-50 px-2.5 py-1 text-navy-700">
          {entry.level.de}
        </span>
      )}
    </div>
  );
}

export default function Step6Education({ entries, onAdd, onUpdate, onRemove, onFormOpenChange }) {
  const t = UI.step6;
  const [mode, setMode] = useState('list');

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
              {t.noEntries}
            </p>
          )}
          <div className="space-y-3">
            {entries.map((entry) => (
              <EducationEntryCard
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
            + {t.addEntry}
          </button>
        </>
      )}

      {mode === 'add' && (
        <EducationEntryForm
          onSave={(draft) => {
            onAdd(draft);
            setMode('list');
          }}
          onCancel={() => setMode('list')}
        />
      )}

      {editingEntry && (
        <EducationEntryForm
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