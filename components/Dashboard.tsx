import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Users, FileText } from 'lucide-react';
import { TASKS, EMPLOYEES, APPROVALS } from '../constants';
import { TaskStatus } from '../types';

interface DashboardProps {
  searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  // Stats
  const totalTasks = TASKS.length;
  const completedTasks = TASKS.filter(t => t.status === TaskStatus.DONE).length;
  const pendingApprovals = APPROVALS.filter(a => a.status === 'Pending').length;
  const avgWorkload = Math.round(EMPLOYEES.reduce((acc, emp) => acc + emp.workload, 0) / EMPLOYEES.length);

  // Filter Recent Activity based on search
  const filteredTasks = TASKS.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart Data
  const tasksByStatus = [
    { name: 'To Do', value: TASKS.filter(t => t.status === TaskStatus.TODO).length, color: '#94a3b8' },
    { name: 'In Progress', value: TASKS.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#3b82f6' },
    { name: 'Review', value: TASKS.filter(t => t.status === TaskStatus.REVIEW).length, color: '#eab308' },
    { name: 'Done', value: TASKS.filter(t => t.status === TaskStatus.DONE).length, color: '#22c55e' },
  ];

  const deptWorkload = [
    { name: 'Eng', workload: 88 },
    { name: 'Product', workload: 92 },
    { name: 'Design', workload: 75 },
    { name: 'QA', workload: 85 },
    { name: 'HR', workload: 60 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</h3>
            </div>
            <div className="p-2 bg-primary-50 rounded-lg">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> +12% from last week
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedTasks}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(completedTasks/totalTasks)*100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Team Workload</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{avgWorkload}%</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Average across 10 employees</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingApprovals}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Action required</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Department Workload</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptWorkload}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="workload" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Task Status</h3>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">{totalTasks}</span>
                <span className="text-xs text-slate-500">Tasks</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {tasksByStatus.map((item) => (
                <div key={item.name} className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: item.color}}></span>
                    <span className="text-slate-600">{item.name}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
            Recent Activity
            {searchQuery && <span className="text-xs font-normal text-slate-400">Filtering by "{searchQuery}"</span>}
        </h3>
        <div className="space-y-4">
            {filteredTasks.length > 0 ? filteredTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-8 h-8 rounded-full mr-3" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                            {task.assignee.name} updated <span className="text-primary-600">{task.title}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Changed status to {task.status}</p>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> 2h ago
                    </span>
                </div>
            )) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                    No matching activity found for "{searchQuery}"
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;