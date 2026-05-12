import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, CheckSquare, Users, Menu, Bell, Search, LogOut,
  DollarSign, CalendarDays, BarChart2, CheckCircle, Database, Book, Sparkles, LucideIcon,
  Sun, Moon, Clock, Globe
} from 'lucide-react';
import Auth from './components/Auth';
import { LoadingState } from './components/common/LoadingState';
import { StatusMessage } from './components/common/StatusMessage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage, Language } from './contexts/LanguageContext';
import { Role, ViewType } from './types';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Tasks = lazy(() => import('./components/Tasks'));
const Employees = lazy(() => import('./components/Employees'));
const Leaves = lazy(() => import('./components/Leaves'));
const Payroll = lazy(() => import('./components/Payroll'));
const Performance = lazy(() => import('./components/Performance'));
const Approvals = lazy(() => import('./components/Approvals'));
const Documents = lazy(() => import('./components/Documents'));
const Wiki = lazy(() => import('./components/Wiki'));
const Assistant = lazy(() => import('./components/Assistant'));

const VIEW_ROLES: Record<ViewType, Role[]> = {
  [ViewType.DASHBOARD]: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'],
  [ViewType.TASKS]: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'],
  [ViewType.APPROVALS]: ['Admin', 'HR', 'Manager'],
  [ViewType.EMPLOYEES]: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'],
  [ViewType.PAYROLL]: ['Admin', 'HR', 'Finance'],
  [ViewType.LEAVES]: ['Admin', 'HR', 'Manager', 'Employee'],
  [ViewType.PERFORMANCE]: ['Admin', 'HR', 'Manager'],
  [ViewType.DOCUMENTS]: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'],
  [ViewType.WIKI]: ['Admin', 'HR', 'Finance', 'Manager', 'Employee'],
  [ViewType.ASSISTANT]: ['Admin', 'HR', 'Finance', 'Manager', 'Employee']
};

const VIEW_PAGE_KEYS: Record<ViewType, string> = {
  [ViewType.DASHBOARD]: 'page.dashboard',
  [ViewType.TASKS]: 'page.tasks',
  [ViewType.APPROVALS]: 'page.approvals',
  [ViewType.EMPLOYEES]: 'page.employees',
  [ViewType.PAYROLL]: 'page.payroll',
  [ViewType.LEAVES]: 'page.leaves',
  [ViewType.PERFORMANCE]: 'page.performance',
  [ViewType.DOCUMENTS]: 'page.documents',
  [ViewType.WIKI]: 'page.wiki',
  [ViewType.ASSISTANT]: 'page.assistant'
};

interface NavItemProps {
  view: ViewType;
  icon: LucideIcon;
  label: string;
  badge?: number;
  currentView: ViewType;
  isVisible: boolean;
  onSelect: (view: ViewType) => void;
}

const NavItem = ({ view, icon: Icon, label, badge, currentView, isVisible, onSelect }: NavItemProps) => {
  if (!isVisible) return null;
  return (
    <button
      onClick={() => onSelect(view)}
      className={`w-full flex items-center px-4 py-3 rounded-xl mb-1 transition-all ${
        currentView === view
          ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-700/20 dark:text-primary-100'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${currentView === view ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`} />
      <span>{label}</span>
      {Boolean(badge) && (
        <span className="ml-auto bg-primary-100 text-primary-700 dark:bg-primary-700/30 dark:text-primary-200 text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

const GroupTitle = ({ title }: { title: string }) => (
  <div className="px-4 mt-6 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
    {title}
  </div>
);

const KazakhstanClock: React.FC = () => {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('ru-RU', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ru-RU', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
      <Clock className="w-4 h-4 text-slate-400 dark:text-slate-400" />
      <span className="font-mono font-medium tabular-nums">{time}</span>
      <span className="text-xs text-slate-400 dark:text-slate-500 ml-0.5">KZ</span>
    </div>
  );
};

const LANG_LABELS: Record<Language, string> = { en: 'EN', ru: 'RU', kz: 'KZ' };
const LANG_OPTIONS: Language[] = ['en', 'ru', 'kz'];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{LANG_LABELS[language]}</span>
      </button>
      {isOpen && (
        <>
          <button className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-label="Close language menu" />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg py-1 min-w-[80px]">
            {LANG_OPTIONS.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setIsOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                  language === lang
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-700/20 dark:text-primary-200 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

const AppShell: React.FC = () => {
  const { user, logout, canAccess } = useAuth();
  const { approvals, notifications, error } = useData();
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const pendingApprovals = approvals.filter((item) => item.status === 'Pending').length;
  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const visibleViews = useMemo(() => new Set(
    Object.entries(VIEW_ROLES)
      .filter(([, roles]) => canAccess(roles))
      .map(([view]) => view as ViewType)
  ), [canAccess]);

  const openView = (view: ViewType) => {
    if (!visibleViews.has(view)) return;
    setCurrentView(view);
    setIsSidebarOpen(false);
    setGlobalSearch('');
  };

  const renderView = () => {
    if (!visibleViews.has(currentView)) {
      return <StatusMessage type="error">{t('common.noAccess')}</StatusMessage>;
    }

    return (
      <Suspense fallback={<LoadingState label={t('common.loading')} />}>
        {currentView === ViewType.DASHBOARD && <Dashboard searchQuery={globalSearch} />}
        {currentView === ViewType.TASKS && <Tasks />}
        {currentView === ViewType.EMPLOYEES && <Employees />}
        {currentView === ViewType.LEAVES && <Leaves />}
        {currentView === ViewType.PAYROLL && <Payroll />}
        {currentView === ViewType.PERFORMANCE && <Performance />}
        {currentView === ViewType.APPROVALS && <Approvals />}
        {currentView === ViewType.DOCUMENTS && <Documents />}
        {currentView === ViewType.WIKI && <Wiki />}
        {currentView === ViewType.ASSISTANT && <Assistant />}
      </Suspense>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100">
      {isSidebarOpen && <button aria-label="Close sidebar" className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">NEXUS</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
            <GroupTitle title={t('nav.main')} />
            <NavItem view={ViewType.DASHBOARD} icon={LayoutDashboard} label={t('nav.dashboard')} currentView={currentView} isVisible={visibleViews.has(ViewType.DASHBOARD)} onSelect={openView} />
            <NavItem view={ViewType.TASKS} icon={CheckSquare} label={t('nav.tasks')} currentView={currentView} isVisible={visibleViews.has(ViewType.TASKS)} onSelect={openView} />
            <NavItem view={ViewType.APPROVALS} icon={CheckCircle} label={t('nav.approvals')} badge={pendingApprovals} currentView={currentView} isVisible={visibleViews.has(ViewType.APPROVALS)} onSelect={openView} />

            <GroupTitle title={t('nav.people')} />
            <NavItem view={ViewType.EMPLOYEES} icon={Users} label={t('nav.employees')} currentView={currentView} isVisible={visibleViews.has(ViewType.EMPLOYEES)} onSelect={openView} />
            <NavItem view={ViewType.PAYROLL} icon={DollarSign} label={t('nav.payroll')} currentView={currentView} isVisible={visibleViews.has(ViewType.PAYROLL)} onSelect={openView} />
            <NavItem view={ViewType.LEAVES} icon={CalendarDays} label={t('nav.leaves')} currentView={currentView} isVisible={visibleViews.has(ViewType.LEAVES)} onSelect={openView} />
            <NavItem view={ViewType.PERFORMANCE} icon={BarChart2} label={t('nav.performance')} currentView={currentView} isVisible={visibleViews.has(ViewType.PERFORMANCE)} onSelect={openView} />

            <GroupTitle title={t('nav.knowledge')} />
            <NavItem view={ViewType.DOCUMENTS} icon={Database} label={t('nav.documents')} currentView={currentView} isVisible={visibleViews.has(ViewType.DOCUMENTS)} onSelect={openView} />
            <NavItem view={ViewType.WIKI} icon={Book} label={t('nav.wiki')} currentView={currentView} isVisible={visibleViews.has(ViewType.WIKI)} onSelect={openView} />

            <GroupTitle title={t('nav.intelligence')} />
            {visibleViews.has(ViewType.ASSISTANT) && (
              <button
                onClick={() => openView(ViewType.ASSISTANT)}
                className={`w-full flex items-center px-4 py-3 rounded-xl mb-1 transition-all relative overflow-hidden group ${
                  currentView === ViewType.ASSISTANT
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 text-slate-700 dark:text-slate-200 hover:shadow-sm'
                }`}
              >
                <Sparkles className={`w-5 h-5 mr-3 ${currentView === ViewType.ASSISTANT ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                <span className="font-medium">{t('nav.assistant')}</span>
              </button>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.accessRole} · {user?.role}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm transition-colors">
              <LogOut className="w-4 h-4 mr-2" /> {t('header.signout')}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 mr-2 lg:hidden text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg" aria-label="Open sidebar">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">{t(VIEW_PAGE_KEYS[currentView])}</h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <KazakhstanClock />

            <div className="hidden md:flex relative">
              <input type="text" placeholder={t('header.search')} value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500" />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <LanguageSwitcher />
            <ThemeToggle />

            <button className="relative p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors" title={notifications[0]?.description || t('header.noNotifications')}>
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full space-y-4">
            {error && <StatusMessage type="error">{error}</StatusMessage>}
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

const AuthGate: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const { t } = useLanguage();
  if (isInitializing) return <LoadingState label={t('auth.loading')} />;
  if (!isAuthenticated) return <Auth />;
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
