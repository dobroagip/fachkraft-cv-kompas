import { UI } from '../i18n/strings';

// Власна нижня панель навігації для кроків 1–6.
// На кроці 7 (перегляд) її ховаємо і замість неї, у Telegram-контексті,
// використовується нативна MainButton (див. Step7Preview.jsx).
export default function StepFooter({ onBack, onNext, nextDisabled = false, showBack = true, nextLabel }) {
  return (
    <div className="no-print sticky bottom-0 left-0 right-0 border-t border-navy-100 bg-paper/95 backdrop-blur px-4 py-3 flex gap-3">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-navy-100 px-5 py-3 text-sm font-medium text-navy-700 active:scale-[0.98] transition-transform"
        >
          {UI.back}
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={[
          'flex-1 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]',
          nextDisabled ? 'bg-navy-100 text-navy-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
        ].join(' ')}
      >
        {nextLabel || UI.next}
      </button>
    </div>
  );
}
