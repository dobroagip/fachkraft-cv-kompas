import { createContext, useContext, useMemo, useState } from 'react';

const CVContext = createContext(null);

const STORAGE_KEY = 'fachkraft-cv-draft-v1';

function loadInitialState() {
  const base = {
    personal: {
      firstName: '',
      firstNameLatin: '',
      lastName: '',
      lastNameLatin: '',
      birthDate: '',
      postalCode: '',
      city: '',
      phone: '',
      email: ''
    },
    experienceEntries: [], // [{id, company, city, periodFrom, periodTo, current, duties:[{ua,de}]}]
    skills: [],
    certificates: [],
    languages: {
      german: null, // {ua, de} from LANGUAGE_LEVELS
      english: null
    },
       education: null, // застаріле поле, залишено для сумісності — не використовується
    educationEntries: [] // [{id, institution, specialty, level:{ua,de}|null, periodFrom, periodTo, current}]
  };

  // Не використовуємо localStorage у Telegram Mini App контексті навмисно,
  // оскільки WebView Telegram може очищати сховище між сесіями. Стан живе
  // в пам'яті вкладки — цього достатньо для одноразового заповнення форми.
  return base;
}

export function CVProvider({ children }) {
  const [data, setData] = useState(loadInitialState);
  const [currentStep, setCurrentStep] = useState(1);

  const updatePersonal = (field, value) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const toggleMultiSelect = (field, option) => {
    setData((prev) => {
      const exists = prev[field].some((item) => item.de === option.de);
      const next = exists
        ? prev[field].filter((item) => item.de !== option.de)
        : [...prev[field], option];
      return { ...prev, [field]: next };
    });
  };

   const addListEntry = (field, entry) => {
    setData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        { ...entry, id: `${field}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
      ]
    }));
  };

  const updateListEntry = (field, id, patch) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
    }));
  };

  const removeListEntry = (field, id) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((entry) => entry.id !== id)
    }));
  };

  const addExperienceEntry = (entry) => addListEntry('experienceEntries', entry);
  const updateExperienceEntry = (id, patch) => updateListEntry('experienceEntries', id, patch);
  const removeExperienceEntry = (id) => removeListEntry('experienceEntries', id);

  const addEducationEntry = (entry) => addListEntry('educationEntries', entry);
  const updateEducationEntry = (id, patch) => updateListEntry('educationEntries', id, patch);
  const removeEducationEntry = (id) => removeListEntry('educationEntries', id);

  const setLanguageLevel = (lang, level) => {
    setData((prev) => ({
      ...prev,
      languages: { ...prev.languages, [lang]: level }
    }));
  };

  // const setEducation = (option) => {
  //   setData((prev) => ({ ...prev, education: option }));
  // };

  const resetAll = () => {
    setData(loadInitialState());
    setCurrentStep(1);
  };

  const value = useMemo(
    () => ({
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
    }),
    [data, currentStep]
  );

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCV must be used within CVProvider');
  return ctx;
}
