import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Loading production data...' }) => (
  <div className="flex min-h-64 items-center justify-center text-slate-500">
    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
    {label}
  </div>
);
