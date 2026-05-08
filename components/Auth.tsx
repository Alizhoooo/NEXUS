import React, { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@kolesa.kz');
  const [password, setPassword] = useState('nexus-demo');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
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
          Production-ready access with API-backed auth and RBAC
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-6 flex items-start rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mr-2 mt-0.5 h-4 w-4" />
              {error}
            </div>
          )}
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
                  onChange={(event) => setEmail(event.target.value)}
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
                  onChange={(event) => setPassword(event.target.value)}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5" /> Sign In</span>}
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
            Demo accounts: admin@kolesa.kz / nexus-demo, hr@kolesa.kz / nexus-hr, finance@kolesa.kz / nexus-finance.
            Production deployments should source users from SSO/OIDC or `NEXUS_USERS_JSON`.
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">Powered by NEXUS Platform © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
