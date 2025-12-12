import React from 'react';
import { LEAVES, EMPLOYEES } from '../constants';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';

const Leaves: React.FC = () => {
  // Simple calendar mock - December 2025
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] overflow-hidden">
      {/* Calendar Section */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">December 2025</h3>
            <div className="flex gap-2">
                <span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span> Vacation</span>
                <span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span> Sick</span>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200 flex-1">
            {weekDays.map(d => (
                <div key={d} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
                    {d}
                </div>
            ))}
            {/* Empty cells for padding (Dec 1st 2025 is a Monday, so no padding needed actually, but let's assume strict grid) */}
            {days.map(day => {
                // Mock leave check
                const isOnLeave = day >= 15 && day <= 29; // Matches Aigerim's leave
                const isSick = day >= 1 && day <= 5; // Matches Yerlan's sick leave

                return (
                    <div key={day} className={`bg-white p-2 min-h-[80px] hover:bg-slate-50 transition-colors relative group border-b border-r border-slate-100 last:border-0`}>
                        <span className={`text-sm font-medium ${
                            day === 12 ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'
                        }`}>{day}</span>
                        
                        {isOnLeave && (
                            <div className="mt-2 text-[10px] bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded truncate">
                                Aigerim T.
                            </div>
                        )}
                        {isSick && (
                            <div className="mt-1 text-[10px] bg-red-100 text-red-800 px-1 py-0.5 rounded truncate">
                                Yerlan Z.
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
      </div>

      {/* Sidebar: Requests & Balances */}
      <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Requests (2)</h3>
            <div className="space-y-4">
                {LEAVES.map(req => (
                    <div key={req.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center mb-2">
                            <img src={req.avatar} className="w-8 h-8 rounded-full mr-2" alt="" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{req.employeeName}</p>
                                <p className="text-xs text-slate-500">{req.type} • {req.days} days</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-3 bg-white p-2 rounded border border-slate-100">
                            {req.reason}
                        </p>
                        <div className="flex gap-2">
                            {req.status === 'Pending' ? (
                                <>
                                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded-md flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Approve
                                    </button>
                                    <button className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs py-1.5 rounded-md flex items-center justify-center">
                                        <XCircle className="w-3 h-3 mr-1" /> Reject
                                    </button>
                                </>
                            ) : (
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Approved</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Leave Balances */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Leave Balances</h3>
            <div className="space-y-4">
                {EMPLOYEES.slice(0, 5).map(emp => (
                    <div key={emp.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <img src={emp.imageUrl} className="w-6 h-6 rounded-full mr-2" alt="" />
                            <span className="text-slate-700 truncate w-32">{emp.firstName} {emp.lastName}</span>
                        </div>
                        <span className="font-medium text-slate-900">14 / 24 days</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;