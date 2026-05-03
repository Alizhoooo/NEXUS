import React, { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { authenticateUser } = await import('../api/auth');
      const user = await authenticateUser(email, password);
      
      if (user) {
        localStorage.setItem('nexus_user', JSON.stringify(user));
        onLoginSuccess();
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка подключения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'manager' | 'employee') => {
    const credentials = {
      admin: { email: 'admin@kolesa.kz', password: 'admin123' },
      manager: { email: 'manager@kolesa.kz', password: 'manager123' },
      employee: { email: 'employee@kolesa.kz', password: 'employee123' }
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">N</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Sign in to NEXUS
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Kolesa Group Business Automation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border outline-none"
                  placeholder="admin@kolesa.kz"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Sign In
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <button 
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="bg-white px-2 text-slate-500 hover:text-primary-600 transition-colors"
                >
                  Demo Access
                </button>
              </div>
            </div>
            
            {showDemoCredentials && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-slate-500 text-center mb-2">Quick login with demo accounts:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => fillDemoCredentials('admin')}
                    className="px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-medium text-purple-700 transition-colors"
                  >
                    👑 Admin
                  </button>
                  <button
                    onClick={() => fillDemoCredentials('manager')}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-medium text-blue-700 transition-colors"
                  >
                    📋 Manager
                  </button>
                  <button
                    onClick={() => fillDemoCredentials('employee')}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                  >
                    👤 Employee
                  </button>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>Demo Credentials:</strong><br/>
                    Admin: admin@kolesa.kz / admin123<br/>
                    Manager: manager@kolesa.kz / manager123<br/>
                    Employee: employee@kolesa.kz / employee123
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center text-xs text-slate-400">
              Different roles have different permissions. Try all three!
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
           <p className="text-xs text-slate-400">Powered by NEXUS Platform © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
