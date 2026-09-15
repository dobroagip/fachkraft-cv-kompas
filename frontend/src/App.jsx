import { useEffect, useState } from 'react';
import { CVProvider, useCV } from './context/CVContext';
import ProgressBar from './components/ProgressBar';
import StepFooter from './components/StepFooter';
import FeedbackSurvey from './components/FeedbackSurvey';
import Step1Personal, { isStep1Valid } from './steps/Step1Personal';
import Step2Experience from './steps/Step2Experience';
import Step3Skills from './steps/Step3Skills';
import Step4Certificates from './steps/Step4Certificates';
import Step5Languages, { isStep5Valid } from './steps/Step5Languages';
import Step6Education from './steps/Step6Education';
import Step7Preview from './steps/Step7Preview';
import { UI } from './i18n/strings';
import { initTelegram, getTelegramUser } from './telegram';
import { logLead, logFeedback } from './utils/api';

const TOTAL_STEPS = 7;

function WizardHeader({ step }) {
  return (
    <header className="no-print sticky top-0 z-10 bg-paper/95 backdrop-blur px-4 pt-4 pb-3 border-b border-navy-100">
      <div className="flex items-center justify-between mb-2.5">
        <h1 className="font-display text-[15px] font-bold text-navy-900">{UI.appTitle}</h1>
        <span className="text-xs text-navy-400">{UI.stepLabel(step, TOTAL_STEPS)}</span>
      </div>
      <ProgressBar step={step} total={TOTAL_STEPS} />
    </header>
  );
}

function Wizard() {
  const {
  data,
  currentStep,
  setCurrentStep,
  updatePersonal,
  toggleMultiSelect,
  addExperienceEntry,
  updateExperienceEntry,
  removeExperienceEntry,
  addEducationEntry,
  updateEducationEntry,
  removeEducationEntry,
  setLanguageLevel,
  resetAll
} = useCV();

    const [downloaded, setDownloaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Скидаємо прапорець "відкрита незбережена форма" щоразу, коли людина
  // переходить на інший крок (наприклад, натиснувши "Назад").
  useEffect(() => {
    setFormOpen(false);
  }, [currentStep]);

  const goNext = () => {
    if (formOpen) return; // не даємо загубити незбережений запис мовчки
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const nextDisabled =
    (currentStep === 1 && !isStep1Valid(data.personal)) ||
    (currentStep === 5 && !isStep5Valid(data.languages)) ||
    formOpen;

  const handleDownloaded = () => {
    setDownloaded(true);
    logLead({ telegramUserId: getTelegramUser()?.id ?? null });
  };

  const handleFeedbackSubmit = (answers) => {
    logFeedback({ telegramUserId: getTelegramUser()?.id ?? null, answers });
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <WizardHeader step={currentStep} />

      <main className="flex-1 px-4 py-5 max-w-xl w-full mx-auto">
        {currentStep === 1 && <Step1Personal personal={data.personal} updatePersonal={updatePersonal} />}
                {currentStep === 2 && (
          <Step2Experience
            entries={data.experienceEntries}
            onAdd={addExperienceEntry}
            onUpdate={updateExperienceEntry}
            onRemove={removeExperienceEntry}
            onFormOpenChange={setFormOpen}
          />
        )}
        {currentStep === 3 && (
          <Step3Skills selected={data.skills} onToggle={(o) => toggleMultiSelect('skills', o)} />
        )}
        {currentStep === 4 && (
          <Step4Certificates selected={data.certificates} onToggle={(o) => toggleMultiSelect('certificates', o)} />
        )}
        {currentStep === 5 && (
          <Step5Languages languages={data.languages} setLanguageLevel={setLanguageLevel} />
        )}
                {currentStep === 6 && (
          <Step6Education
            entries={data.educationEntries}
            onAdd={addEducationEntry}
            onUpdate={updateEducationEntry}
            onRemove={removeEducationEntry}
            onFormOpenChange={setFormOpen}
          />
        )}
        {currentStep === 7 && (
          <>
            <Step7Preview data={data} onDownloaded={handleDownloaded} />
            {downloaded && (
              <div className="mt-5 no-print">
                <FeedbackSurvey onSubmit={handleFeedbackSubmit} />
                <button
                  type="button"
                  onClick={resetAll}
                  className="w-full mt-3 text-xs text-navy-400 underline underline-offset-2"
                >
                  {UI.startOver}
                </button>
              </div>
            )}
          </>
        )}
      </main>

            {currentStep < 7 ? (
        <>
          {formOpen && (
            <p className="no-print text-center text-xs text-amber-700 bg-amber-50 px-4 py-1.5">
              Спочатку натисніть «Зберегти запис» або «Скасувати» у формі вище.
            </p>
          )}
          <StepFooter
            onBack={goBack}
            onNext={goNext}
            showBack={currentStep > 1}
            nextDisabled={nextDisabled}
          />
        </>
      ) : (
        <div className="no-print sticky bottom-0 left-0 right-0 border-t border-navy-100 bg-paper/95 backdrop-blur px-4 py-3">
          <button
            type="button"
            onClick={goBack}
            className="rounded-xl border border-navy-100 px-5 py-3 text-sm font-medium text-navy-700 active:scale-[0.98] transition-transform"
          >
            {UI.back}
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <CVProvider>
      <Wizard />
    </CVProvider>
  );
}
