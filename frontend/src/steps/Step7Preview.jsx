import { useEffect, useState } from 'react';
import ResumePreview from '../components/ResumePreview';
import { UI } from '../i18n/strings';
import { isTelegram, setMainButton, hideMainButton } from '../telegram';
import { printResume, downloadResumeAsImage } from '../utils/exportPdf';

export default function Step7Preview({ data, onDownloaded }) {
  const t = UI.step7;
  const [fallbackBusy, setFallbackBusy] = useState(false);

  const noExperience = data.experienceEntries.length === 0;
  const noEducation = data.educationEntries.length === 0;

  const handleDownload = () => {
    printResume();
    // Ми не можемо на 100% дізнатися, чи справді відбувся друк/збереження
    // (window.print() асинхронний і по-різному поводиться між браузерами),
    // тому фіксуємо намір одразу — це достатньо точно для звіту гранту.
    onDownloaded();
  };

  const handleFallbackDownload = async () => {
    setFallbackBusy(true);
    try {
      await downloadResumeAsImage('cv-print-root', 'Lebenslauf.pdf');
      onDownloaded();
    } catch (e) {
      console.error(e);
    } finally {
      setFallbackBusy(false);
    }
  };

  // У Telegram-контексті на останньому кроці використовуємо нативну
  // MainButton замість власної кнопки — це очікуваний UX для Mini Apps.
  useEffect(() => {
    if (!isTelegram) return undefined;
    const cleanup = setMainButton({ text: UI.downloadPdf, onClick: handleDownload });
    return () => {
      cleanup();
      hideMainButton();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 pb-4">
            <div>
        <h2 className="font-display text-xl font-bold text-navy-900">{t.title}</h2>
        <p className="text-sm text-navy-400 mt-1">{t.hint}</p>
      </div>

      {(noExperience || noEducation) && (
        <div
          className={[
            'no-print rounded-xl border px-3.5 py-2.5 text-xs',
            noExperience && noEducation
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-amber-200 bg-amber-50 text-navy-800'
          ].join(' ')}
        >
          {noExperience && noEducation
            ? t.warnBothEmpty
            : noExperience
              ? t.warnNoExperience
              : t.warnNoEducation}
        </div>
      )}

      <div className="bg-navy-50/40 rounded-2xl p-2 sm:p-4">
        <ResumePreview data={data} />
      </div>

      <div className="no-print space-y-2">
        {!isTelegram && (
          <button
            type="button"
            onClick={handleDownload}
            className="w-full rounded-xl bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-amber-700 active:scale-[0.98] transition-all"
          >
            {UI.downloadPdf}
          </button>
        )}
                <button
          type="button"
          onClick={handleFallbackDownload}
          disabled={fallbackBusy}
          className="w-full text-xs text-navy-400 underline underline-offset-2 disabled:opacity-50"
        >
          {fallbackBusy ? '…' : 'Не вдалося зберегти? Спробувати інший спосіб'}
        </button>
        <p className="text-center text-[11px] text-navy-400">🔒 {UI.privacyNotice}</p>
      </div>
    </div>
  );
}
