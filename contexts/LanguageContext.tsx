import React, { createContext, useCallback, useContext, useState } from 'react';

export type Language = 'en' | 'ru' | 'kz';

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.main': { en: 'Main', ru: 'Главное', kz: 'Негізгі' },
  'nav.dashboard': { en: 'Dashboard', ru: 'Панель', kz: 'Панель' },
  'nav.tasks': { en: 'Tasks', ru: 'Задачи', kz: 'Тапсырмалар' },
  'nav.approvals': { en: 'Approvals', ru: 'Согласования', kz: 'Келісімдер' },
  'nav.people': { en: 'People', ru: 'Люди', kz: 'Адамдар' },
  'nav.employees': { en: 'Employees', ru: 'Сотрудники', kz: 'Қызметкерлер' },
  'nav.payroll': { en: 'Payroll', ru: 'Зарплата', kz: 'Жалақы' },
  'nav.leaves': { en: 'Leaves', ru: 'Отпуска', kz: 'Демалыстар' },
  'nav.performance': { en: 'Performance', ru: 'Результаты', kz: 'Нәтижелер' },
  'nav.knowledge': { en: 'Knowledge', ru: 'Знания', kz: 'Білім' },
  'nav.documents': { en: 'Documents', ru: 'Документы', kz: 'Құжаттар' },
  'nav.wiki': { en: 'Wiki', ru: 'Вики', kz: 'Вики' },
  'nav.intelligence': { en: 'Intelligence', ru: 'Интеллект', kz: 'Интеллект' },
  'nav.assistant': { en: 'AI Assistant', ru: 'AI Ассистент', kz: 'AI Көмекші' },
  // Header
  'header.search': { en: 'Search...', ru: 'Поиск...', kz: 'Іздеу...' },
  'header.signout': { en: 'Sign Out', ru: 'Выйти', kz: 'Шығу' },
  'header.noNotifications': { en: 'No notifications', ru: 'Нет уведомлений', kz: 'Хабарламалар жоқ' },
  // Page titles
  'page.dashboard': { en: 'Dashboard', ru: 'Панель управления', kz: 'Басқару панелі' },
  'page.tasks': { en: 'Tasks', ru: 'Задачи', kz: 'Тапсырмалар' },
  'page.approvals': { en: 'Approvals', ru: 'Согласования', kz: 'Келісімдер' },
  'page.employees': { en: 'Employees', ru: 'Сотрудники', kz: 'Қызметкерлер' },
  'page.payroll': { en: 'Payroll', ru: 'Зарплата', kz: 'Жалақы' },
  'page.leaves': { en: 'Leaves', ru: 'Отпуска', kz: 'Демалыстар' },
  'page.performance': { en: 'Performance', ru: 'Результаты', kz: 'Нәтижелер' },
  'page.documents': { en: 'Documents', ru: 'Документы', kz: 'Құжаттар' },
  'page.wiki': { en: 'Wiki', ru: 'Вики', kz: 'Вики' },
  'page.assistant': { en: 'AI Assistant', ru: 'AI Ассистент', kz: 'AI Көмекші' },
  // Auth
  'auth.login': { en: 'Sign In', ru: 'Войти', kz: 'Кіру' },
  'auth.email': { en: 'Email', ru: 'Эл. почта', kz: 'Эл. пошта' },
  'auth.password': { en: 'Password', ru: 'Пароль', kz: 'Құпия сөз' },
  'auth.loading': { en: 'Restoring secure session...', ru: 'Восстановление сессии...', kz: 'Сессияны қалпына келтіру...' },
  // Common
  'common.loading': { en: 'Loading workspace...', ru: 'Загрузка...', kz: 'Жүктелуде...' },
  'common.noAccess': { en: 'Your role does not have access to this workspace.', ru: 'У вашей роли нет доступа к этому разделу.', kz: 'Сіздің рөліңіздің бұл бөлімге рұқсаты жоқ.' },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('nexus-language');
    if (stored === 'en' || stored === 'ru' || stored === 'kz') return stored;
    return 'ru';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
