import ChipSelect from '../components/ChipSelect';
import { SKILLS_OPTIONS } from '../data/options';
import { UI } from '../i18n/strings';

export default function Step3Skills({ selected, onToggle }) {
  const t = UI.step3;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-navy-900">{t.title}</h2>
        <p className="text-sm text-navy-400 mt-1">{t.hint}</p>
      </div>
      <ChipSelect options={SKILLS_OPTIONS} selected={selected} onToggle={onToggle} />
    </div>
  );
}
