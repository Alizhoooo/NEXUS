import React from 'react';

export const StatusMessage: React.FC<{ type?: 'info' | 'error' | 'success'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const classes = {
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    success: 'bg-green-50 text-green-700 border-green-100'
  };
  return <div className={`rounded-lg border px-4 py-3 text-sm ${classes[type]}`}>{children}</div>;
};
