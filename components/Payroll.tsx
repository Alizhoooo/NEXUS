import React from 'react';
import { PAYROLL_DATA } from '../constants';
import { Download, Printer, DollarSign } from 'lucide-react';

const Payroll: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <p className="text-sm text-slate-500">Total Payroll (Dec)</p>
             <h3 className="text-2xl font-bold text-slate-900 mt-1">₸ 45,200,000</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <p className="text-sm text-slate-500">Average Net Salary</p>
             <h3 className="text-2xl font-bold text-slate-900 mt-1">₸ 1,250,000</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <p className="text-sm text-slate-500">Bonuses Paid</p>
             <h3 className="text-2xl font-bold text-green-600 mt-1">₸ 5,400,000</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Payroll Records - December 2025</h3>
            <button className="flex items-center text-sm text-slate-600 hover:text-primary-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-right">Base Salary</th>
                <th className="px-6 py-4 text-right">Bonus</th>
                <th className="px-6 py-4 text-right">Deductions</th>
                <th className="px-6 py-4 text-right">Net Salary</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PAYROLL_DATA.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={record.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <div className="font-medium text-slate-900">{record.employeeName}</div>
                        <div className="text-xs text-slate-500">ID: {record.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{record.department}</td>
                  <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(record.baseSalary)}</td>
                  <td className="px-6 py-4 text-right text-green-600">+{formatCurrency(record.bonus)}</td>
                  <td className="px-6 py-4 text-right text-red-500">-{formatCurrency(record.deductions)}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(record.netSalary)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        record.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-400 hover:text-slate-600">
                        <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;