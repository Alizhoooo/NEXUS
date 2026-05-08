import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('NEXUS UI error', { error, info });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-bold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">The application captured the error safely. Please refresh or contact support.</p>
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{this.state.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
