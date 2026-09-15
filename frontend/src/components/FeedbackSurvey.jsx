import { useState } from 'react';
import { UI } from '../i18n/strings';
import { hapticImpact } from '../telegram';

function QuestionButtons({ question, options, value, onSelect }) {
  return (
    <div>
      <p className="text-sm font-medium text-navy-900 mb-2">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              hapticImpact('light');
              onSelect(opt.value);
            }}
            className={[
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              value === opt.value
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-navy-100 bg-white text-navy-700'
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeedbackSurvey({ onSubmit }) {
  const t = UI.survey;
  const [answers, setAnswers] = useState({ clarity: null, helpful: null, difficulty: null });
  const [submitted, setSubmitted] = useState(false);

  const yesNoPartly = [
    { value: 'yes', label: t.yes },
    { value: 'partly', label: t.partly },
    { value: 'no', label: t.no }
  ];

  const difficultyOptions = [
    { value: 'language', label: t.optionLanguage },
    { value: 'steps', label: t.optionSteps },
    { value: 'phone', label: t.optionPhone },
    { value: 'nothing', label: t.optionNothing }
  ];

  const complete = answers.clarity && answers.helpful && answers.difficulty;

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(answers);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm text-navy-900">
        {t.thanks}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white px-4 py-5 space-y-5">
      <h3 className="font-display text-base font-bold text-navy-900">{t.title}</h3>
      <QuestionButtons
        question={t.q1}
        options={yesNoPartly}
        value={answers.clarity}
        onSelect={(v) => setAnswers((a) => ({ ...a, clarity: v }))}
      />
      <QuestionButtons
        question={t.q2}
        options={yesNoPartly}
        value={answers.helpful}
        onSelect={(v) => setAnswers((a) => ({ ...a, helpful: v }))}
      />
      <QuestionButtons
        question={t.q3}
        options={difficultyOptions}
        value={answers.difficulty}
        onSelect={(v) => setAnswers((a) => ({ ...a, difficulty: v }))}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!complete}
        className={[
          'w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all',
          complete ? 'bg-navy-900 hover:bg-navy-700' : 'bg-navy-100 text-navy-400 cursor-not-allowed'
        ].join(' ')}
      >
        {t.submit}
      </button>
    </div>
  );
}
