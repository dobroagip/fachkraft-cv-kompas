import LanguageLevelSelect from '../components/LanguageLevelSelect';
import { UI } from '../i18n/strings';

export default function Step5Languages({ languages, setLanguageLevel }) {
  const t = UI.step5;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-navy-900">{t.title}</h2>
        <p className="text-sm text-navy-400 mt-1">{t.hint}</p>
      </div>

      <div className="rounded-xl border border-navy-100 bg-white px-4 py-3.5 flex items-center justify-between">
        <span className="text-sm font-medium text-navy-900">{t.ukrainian}</span>
        <span className="text-sm text-navy-400">{t.ukrainianNative}</span>
      </div>

      <LanguageLevelSelect
        label={t.german}
        value={languages.german}
        onChange={(level) => setLanguageLevel('german', level)}
      />

      <LanguageLevelSelect
        label={t.english}
        value={languages.english}
        onChange={(level) => setLanguageLevel('english', level)}
        allowNone
        noneLabel={t.noEnglish}
      />
    </div>
  );
}

export function isStep5Valid(languages) {
  return Boolean(languages.german);
}
