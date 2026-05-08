import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Users, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { TaskStatus } from '../types';
import { LoadingState } from './common/LoadingState';

interface DashboardProps {
  searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  const { tasks, employees, approvals, isLoading } = useData();
  if (isLoading && tasks.length === 0) return <LoadingState />;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.DONE).length;
  const pendingApprovals = approvals.filter((approval) => approval.status === 'Pending').length;
  const avgWorkload = employees.length ? Math.round(employees.reduce((acc, employee) => acc + employee.workload, 0) / employees.length) : 0;

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByStatus = [
    { name: 'To Do', value: tasks.filter((task) => task.status === TaskStatus.TODO).length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length, color: '#3b82f6' },
    { name: 'Review', value: tasks.filter((task) => task.status === TaskStatus.REVIEW).length, color: '#eab308' },
    { name: 'Done', value: completedTasks, color: '#22c55e' }
  ];

  const deptWorkload = Object.values(employees.reduce<Record<string, { name: string; workload: number; count: number }>>((acc, employee) => {
    const key = employee.department;
    acc[key] = acc[key] || { name: key, workload: 0, count: 0 };
    acc[key].workload += employee.workload;
    acc[key].count += 1;
    return acc;
  }, {})).map((dept) => ({ name: dept.name.slice(0, 10), workload: Math.round(dept.workload / dept.count) }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500">Total Tasks</p><h3 className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</h3></div>
            <div className="p-2 bg-primary-50 rounded-lg"><FileText className="h-5 w-5 text-primary-600" /></div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> API-backed workspace</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500">Completed</p><h3 className="text-2xl font-bold text-slate-900 mt-1">{completedTasks}</h3></div>
            <div className="p-2 bg-green-50 rounded-lg"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500">Team Workload</p><h3 className="text-2xl font-bold text-slate-900 mt-1">{avgWorkload}%</h3></div>
            <div className="p-2 bg-purple-50 rounded-lg"><Users className="h-5 w-5 text-purple-600" /></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Average across {employees.length} employees</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div><p className="text-sm font-medium text-slate-500">Pending Approvals</p><h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingApprovals}</h3></div>
            <div className="p-2 bg-orange-50 rounded-lg"><AlertTriangle className="h-5 w-5 text-orange-600" /></div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Audit logged decisions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Department Workload</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={deptWorkload}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#f1f5f9' }} /><Bar dataKey="workload" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} /></BarChart></ResponsiveContainer></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Task Status</h3>
          <div className="h-64 relative"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={tasksByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{tasksByStatus.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none"><span className="text-3xl font-bold text-slate-800">{totalTasks}</span><span className="text-xs text-slate-500">Tasks</span></div></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">Recent Activity{searchQuery && <span className="text-xs font-normal text-slate-400">Filtering by &quot;{searchQuery}&quot;</span>}</h3>
        <div className="space-y-4">
          {filteredTasks.length > 0 ? filteredTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <img src={task.assignee.avatar} alt={task.assignee.name} className="w-8 h-8 rounded-full mr-3" />
              <div className="flex-1"><p className="text-sm font-medium text-slate-900">{task.assignee.name} updated <span className="text-primary-600">{task.title}</span></p><p className="text-xs text-slate-500 mt-0.5">Changed status to {task.status}</p></div>
              <span className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> live</span>
            </div>
          )) : <div className="text-center py-8 text-slate-400 text-sm">No matching activity found for &quot;{searchQuery}&quot;</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
