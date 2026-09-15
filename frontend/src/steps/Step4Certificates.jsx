import ChipSelect from '../components/ChipSelect';
import { CERTIFICATE_OPTIONS } from '../data/options';
import { UI } from '../i18n/strings';

export default function Step4Certificates({ selected, onToggle }) {
  const t = UI.step4;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-navy-900">{t.title}</h2>
        <p className="text-sm text-navy-400 mt-1">{t.hint}</p>
      </div>
      <ChipSelect options={CERTIFICATE_OPTIONS} selected={selected} onToggle={onToggle} />
    </div>
  );
}
