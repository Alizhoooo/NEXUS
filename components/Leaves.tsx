import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { LeaveRequest } from '../types';
import { StatusMessage } from './common/StatusMessage';

const Leaves: React.FC = () => {
  const { leaves, employees, decideLeave } = useData();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const updateStatus = async (id: string, status: LeaveRequest['status']) => {
    if (!window.confirm(`${status} this leave request?`)) return;
    setSavingId(id);
    setError(null);
    try {
      await decideLeave(id, status);
      setNotice(`Leave request ${status.toLowerCase()} and audit logged.`);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Unable to update leave request');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {notice && <StatusMessage type="success">{notice}</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] overflow-hidden">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-slate-900">December 2025</h3><div className="flex gap-2"><span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1" /> Vacation</span><span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-400 mr-1" /> Sick</span></div></div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200 flex-1">
            {weekDays.map((day) => <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">{day}</div>)}
            {days.map((day) => {
              const activeLeaves = leaves.filter((leave) => leave.status !== 'Rejected' && day >= Number(leave.startDate.slice(-2)) && day <= Number(leave.endDate.slice(-2)));
              return (
                <div key={day} className="bg-white p-2 min-h-[80px] hover:bg-slate-50 transition-colors relative group border-b border-r border-slate-100 last:border-0">
                  <span className={`text-sm font-medium ${day === new Date().getDate() ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>{day}</span>
                  {activeLeaves.slice(0, 2).map((leave) => <div key={leave.id} className="mt-1 text-[10px] bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded truncate">{leave.employeeName}</div>)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900 mb-4">Requests ({leaves.length})</h3><div className="space-y-4">
            {leaves.length === 0 && <div className="text-center text-sm text-slate-400">No leave requests.</div>}
            {leaves.map((req) => <div key={req.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100"><div className="flex items-center mb-2"><img src={req.avatar} className="w-8 h-8 rounded-full mr-2" alt="" /><div><p className="text-sm font-semibold text-slate-900">{req.employeeName}</p><p className="text-xs text-slate-500">{req.type} • {req.days} days</p></div></div><p className="text-xs text-slate-600 mb-3 bg-white p-2 rounded border border-slate-100">{req.reason}</p><div className="flex gap-2">{req.status === 'Pending' ? <><button disabled={savingId === req.id} onClick={() => updateStatus(req.id, 'Approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded-md flex items-center justify-center disabled:opacity-60"><CheckCircle className="w-3 h-3 mr-1" /> Approve</button><button disabled={savingId === req.id} onClick={() => updateStatus(req.id, 'Rejected')} className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs py-1.5 rounded-md flex items-center justify-center disabled:opacity-60"><XCircle className="w-3 h-3 mr-1" /> Reject</button></> : <span className={`text-xs font-medium px-2 py-1 rounded ${req.status === 'Approved' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{req.status}</span>}</div></div>)}
          </div></div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"><h3 className="text-lg font-bold text-slate-900 mb-4">Leave Balances</h3><div className="space-y-4">{employees.slice(0, 5).map((emp) => <div key={emp.id} className="flex items-center justify-between text-sm"><div className="flex items-center"><img src={emp.imageUrl} className="w-6 h-6 rounded-full mr-2" alt="" /><span className="text-slate-700 truncate w-32">{emp.firstName} {emp.lastName}</span></div><span className="font-medium text-slate-900">14 / 24 days</span></div>)}</div></div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;
