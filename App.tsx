import React, { useState } from 'react';
import { 
  LayoutDashboard, CheckSquare, Users, FileText, Settings, 
  Menu, X, Bell, Search, LogOut, Briefcase, DollarSign, 
  CalendarDays, BarChart2, CheckCircle, Database, Book, Sparkles
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Employees from './components/Employees';
import Leaves from './components/Leaves';
import Payroll from './components/Payroll';
import Performance from './components/Performance';
import Approvals from './components/Approvals';
import Documents from './components/Documents';
import Wiki from './components/Wiki';
import Assistant from './components/Assistant';
import Auth from './components/Auth';
import { ViewType } from './types';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  const NavItem = ({ view, icon: Icon, label, badge }: { view: ViewType, icon: any, label: string, badge?: number }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false); // Close mobile sidebar on click
        setGlobalSearch(''); // Reset search on view change
      }}
      className={`w-full flex items-center px-4 py-3 rounded-xl mb-1 transition-all ${
        currentView === view 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${currentView === view ? 'text-primary-600' : 'text-slate-400'}`} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
        </span>
      )}
    </button>
  );

  const GroupTitle = ({ title }: { title: string }) => (
    <div className="px-4 mt-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
      {title}
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">NEXUS</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
            <GroupTitle title="Main" />
            <NavItem view={ViewType.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <NavItem view={ViewType.TASKS} icon={CheckSquare} label="Tasks" badge={8} />
            <NavItem view={ViewType.APPROVALS} icon={CheckCircle} label="Approvals" badge={2} />

            <GroupTitle title="People" />
            <NavItem view={ViewType.EMPLOYEES} icon={Users} label="Employees" />
            <NavItem view={ViewType.PAYROLL} icon={DollarSign} label="Payroll" />
            <NavItem view={ViewType.LEAVES} icon={CalendarDays} label="Leaves" />
            <NavItem view={ViewType.PERFORMANCE} icon={BarChart2} label="Performance" />

            <GroupTitle title="Knowledge" />
            <NavItem view={ViewType.DOCUMENTS} icon={Database} label="Documents" />
            <NavItem view={ViewType.WIKI} icon={Book} label="Wiki" />

            <GroupTitle title="Intelligence" />
            <div className="mt-1">
                 <button
                    onClick={() => {
                        setCurrentView(ViewType.ASSISTANT);
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl mb-1 transition-all relative overflow-hidden group ${
                        currentView === ViewType.ASSISTANT
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md'
                        : 'bg-gradient-to-r from-primary-50 to-purple-50 text-slate-700 hover:shadow-sm'
                    }`}
                    >
                    <Sparkles className={`w-5 h-5 mr-3 ${currentView === ViewType.ASSISTANT ? 'text-white' : 'text-purple-600'}`} />
                    <span className="font-medium">AI Assistant</span>
                    {currentView !== ViewType.ASSISTANT && (
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4">
                <img src={CURRENT_USER.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{CURRENT_USER.name}</p>
                    <p className="text-xs text-slate-500 truncate">{CURRENT_USER.role}</p>
                </div>
            </div>
            <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full flex items-center justify-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm transition-colors"
            >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-2 mr-2 lg:hidden text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 capitalize">
                    {currentView.toLowerCase().replace('_', ' ')}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex relative">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                
                <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto h-full">
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
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;