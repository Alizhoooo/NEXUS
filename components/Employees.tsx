import React from 'react';
import { EMPLOYEES } from '../constants';
import { Mail, MapPin, MoreVertical, Search, Filter } from 'lucide-react';

const Employees: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
          <p className="text-slate-500 text-sm">Total {EMPLOYEES.length} active team members</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search employees..." 
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary-500 outline-none"
                />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                <Filter className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {EMPLOYEES.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center relative hover:shadow-md transition-shadow group">
            <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-600">
                <MoreVertical className="w-5 h-5" />
            </button>
            
            <div className="relative mb-4">
                <img 
                    src={employee.imageUrl} 
                    alt={`${employee.firstName} ${employee.lastName}`} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50"
                />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    employee.status === 'Active' ? 'bg-green-500' :
                    employee.status === 'On Leave' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></span>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900">{employee.firstName} {employee.lastName}</h3>
            <p className="text-sm text-primary-600 font-medium mb-1">{employee.role}</p>
            <p className="text-xs text-slate-500 mb-4">{employee.department}</p>
            
            {/* Workload Indicator */}
            <div className="w-full mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Workload</span>
                    <span className="font-medium text-slate-700">{employee.workload}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                        className={`h-1.5 rounded-full ${
                            employee.workload > 90 ? 'bg-red-500' : 'bg-primary-500'
                        }`} 
                        style={{ width: `${employee.workload}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex gap-2 w-full mt-auto pt-4 border-t border-slate-100">
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center justify-center">
                    <Mail className="w-3 h-3 mr-1.5" /> Email
                </button>
                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center justify-center">
                    <MapPin className="w-3 h-3 mr-1.5" /> {employee.location ? 'Loc' : 'Profile'}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;