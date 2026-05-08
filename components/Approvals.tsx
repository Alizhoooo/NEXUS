import React, { useState } from 'react';
import { Check, X, FileText, CreditCard, Calendar, Lock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ApprovalRequest } from '../types';
import { StatusMessage } from './common/StatusMessage';

const Approvals: React.FC = () => {
  const { approvals, decideApproval } = useData();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Leave': return <Calendar className="w-5 h-5 text-purple-600" />;
      case 'Expense': return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'Access': return <Lock className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const updateStatus = async (id: string, status: ApprovalRequest['status']) => {
    if (!window.confirm(`${status} this request?`)) return;
    setSavingId(id);
    setError(null);
    try {
      await decideApproval(id, status);
      setNotice(`Request ${status.toLowerCase()} and written to the audit log.`);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Unable to update approval');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Approvals</h2>
      {notice && <StatusMessage type="success">{notice}</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {approvals.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No approval requests.</div>}
          {approvals.map((req) => (
            <div key={req.id} className="p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 hover:bg-slate-50 transition-colors">
              <div className="p-3 rounded-full bg-slate-100 flex-shrink-0">{getIcon(req.type)}</div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-slate-900">{req.type} Request</h4>
                  <span className="text-xs text-slate-500">• {req.date}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${req.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{req.status}</span>
                </div>
                <p className="text-slate-600 text-sm mb-1">{req.details} {req.amount && <span className="font-semibold text-slate-900">— {req.amount}</span>}</p>
                <div className="flex items-center justify-center md:justify-start gap-2"><img src={req.avatar} alt="" className="w-5 h-5 rounded-full" /><span className="text-xs text-slate-500">Requested by <span className="font-medium text-slate-700">{req.requestor}</span></span></div>
              </div>

              {req.status === 'Pending' && (
                <div className="flex gap-3">
                  <button disabled={savingId === req.id} onClick={() => updateStatus(req.id, 'Approved')} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors disabled:opacity-60"><Check className="w-4 h-4 mr-2" /> Approve</button>
                  <button disabled={savingId === req.id} onClick={() => updateStatus(req.id, 'Rejected')} className="flex items-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-sm transition-colors disabled:opacity-60"><X className="w-4 h-4 mr-2" /> Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
