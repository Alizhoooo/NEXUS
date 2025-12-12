import React, { useState } from 'react';
import { Book, ChevronRight, Search, Building, Code, Users, Briefcase, FileText, Globe, GraduationCap } from 'lucide-react';

const Wiki: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('About Kolesa Group');

  const categories = [
    { id: 'About Kolesa Group', icon: Building, label: 'About Company' },
    { id: 'Product Ecosystem', icon: Briefcase, label: 'Products & Strategy' },
    { id: 'Engineering Standards', icon: Code, label: 'Engineering' },
    { id: 'HR & Culture', icon: Users, label: 'HR & Culture' },
    { id: 'Onboarding', icon: GraduationCap, label: 'Onboarding' }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'About Kolesa Group':
        return (
          <article className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-8 relative h-48 bg-gradient-to-r from-primary-600 to-blue-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="text-center text-white z-10 relative px-4">
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">Kolesa Group</h1>
                    <p className="text-blue-100 text-lg font-medium">Fintech & Classifieds Ecosystem</p>
                </div>
            </div>

            <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-slate-600 mb-8">
                    <strong className="text-slate-900">Kolesa Group</strong> is a leading IT company in Kazakhstan. We develop high-load products that help millions of people buy, sell, rent, and find services every day. Our DNA relies on data-driven decisions, rapid hypothesis testing, and a product-centric approach.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-8 mb-6 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-primary-600"/> Key Products
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all hover:shadow-md cursor-default">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-blue-600">K</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Kolesa.kz</h4>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">#1 Auto Classifieds in KZ. Cars, parts, and auto-services with 5M+ monthly users.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-yellow-400 transition-all hover:shadow-md cursor-default">
                        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-yellow-600">Kr</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Krisha.kz</h4>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">The biggest real estate platform. Renting, buying, and mortgage integration.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-green-400 transition-all hover:shadow-md cursor-default">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-green-600">M</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Market.kz</h4>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">General classifieds board for goods, jobs, and services across the country.</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">Our Values</h3>
                <div className="bg-slate-50 rounded-xl p-6 not-prose border border-slate-100">
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-slate-700"><strong className="text-slate-900">Data Driven:</strong> We trust numbers over opinions. Every change is A/B tested.</p>
                        </li>
                        <li className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-slate-700"><strong className="text-slate-900">Users First:</strong> Every feature starts with user needs and comprehensive research.</p>
                        </li>
                        <li className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-slate-700"><strong className="text-slate-900">Continuous Growth:</strong> We invest heavily in employee education, conferences, and internal meetups.</p>
                        </li>
                    </ul>
                </div>
            </div>
          </article>
        );

      case 'Engineering Standards':
        return (
          <article className="animate-in fade-in slide-in-from-bottom-2 duration-300 prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Engineering Standards</h1>
            <p className="text-slate-600 mb-6 text-lg">
                We maintain high code quality standards to ensure scalability and performance across our microservices architecture.
            </p>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Frontend (NEXUS Platform)</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>Stack:</strong> React 19, TypeScript, Vite, Tailwind CSS.</li>
                <li><strong>State Management:</strong> Context API for simple state, Zustand for complex flows.</li>
                <li><strong>Testing:</strong> Jest + React Testing Library. Minimum 80% coverage for core components.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Backend & Infrastructure</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong>Languages:</strong> Go (Golang) for high-load services, PHP (Legacy/Monolith), Python (ML models).</li>
                <li><strong>Orchestration:</strong> Kubernetes (K8s) for all production services.</li>
                <li><strong>CI/CD:</strong> GitLab CI with automated linting, testing, and deployment pipelines.</li>
            </ul>

            <div className="mt-8 bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm shadow-md">
                <p className="text-slate-500 mb-2 border-b border-slate-700 pb-2">// Example: TypeScript Strict Interface</p>
                <pre className="text-blue-300 bg-transparent p-0">{`interface ServiceResponse<T> {
  data: T;
  meta: {
    page: number;
    total: number;
    limit: number;
  };
  status: 'success' | 'error';
  timestamp: string;
}`}</pre>
            </div>
          </article>
        );

      case 'Product Ecosystem':
         return (
             <article className="animate-in fade-in slide-in-from-bottom-2 duration-300 prose prose-slate max-w-none">
                 <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Ecosystem & Strategy</h1>
                 <p className="text-slate-600 mb-8 text-lg">Overview of our current strategic direction, expansion plans, and product roadmap.</p>
                 
                 <div className="space-y-6 not-prose">
                    <div className="bg-white p-6 rounded-xl border-l-4 border-primary-500 shadow-sm border-t border-r border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Global Expansion (Avtoelon.uz)</h3>
                        <p className="text-slate-600">Aggressive expansion in Uzbekistan. Focusing on localization, adaptation to local market specifics, and marketing growth.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-l-4 border-primary-500 shadow-sm border-t border-r border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Fintech Integration</h3>
                        <p className="text-slate-600">Deep integration with banking partners (Kaspi, Halyk) for seamless auto loans and mortgages directly within the application interface.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-l-4 border-primary-500 shadow-sm border-t border-r border-b border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">AI & Big Data</h3>
                        <p className="text-slate-600">Utilizing Gemini and internal ML models for fraud detection, price prediction algorithms, and personalized user feeds.</p>
                    </div>
                 </div>
             </article>
         );

      case 'HR & Culture':
          return (
              <article className="animate-in fade-in slide-in-from-bottom-2 duration-300 prose prose-slate max-w-none">
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">HR & Culture</h1>
                  <p className="text-slate-600 mb-8 text-lg">We value people who are proactive, data-driven, and open to feedback. Our culture is built on trust and ownership.</p>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Employee Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
                      <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                          <span className="font-medium text-slate-700">Premium Medical Insurance</span>
                      </div>
                      <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                          <span className="font-medium text-slate-700">Training Budget & Conferences</span>
                      </div>
                      <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                          <span className="font-medium text-slate-700">Free Lunches & Office Gym</span>
                      </div>
                      <div className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-bold">✓</span>
                          <span className="font-medium text-slate-700">Flexible Hybrid Work Schedule</span>
                      </div>
                  </div>
              </article>
          );
      
      default:
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Book className="w-16 h-16 mb-4 opacity-10" />
                <p>Select a category to view details</p>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
        <div className="relative mb-6">
            <input type="text" placeholder="Search Wiki..." className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        </div>
        
        <div className="space-y-1 flex-1 overflow-y-auto pr-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Navigation</h4>
            {categories.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between group transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    <div className="flex items-center">
                        <cat.icon className={`w-4 h-4 mr-3 ${activeCategory === cat.id ? 'text-primary-600' : 'text-slate-400'}`} />
                        {cat.label}
                    </div>
                    {activeCategory === cat.id && <ChevronRight className="w-4 h-4 text-primary-500" />}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 pb-4 border-b border-slate-100">
                <Book className="w-4 h-4" />
                <span>Wiki</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-slate-900">{activeCategory}</span>
            </div>

            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Wiki;