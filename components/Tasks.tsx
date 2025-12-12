import React, { useState, useMemo } from 'react';
import { TASKS, EMPLOYEES, CURRENT_USER } from '../constants';
import { Task, TaskStatus, Priority } from '../types';
import { 
  Search, Filter, LayoutGrid, List, Plus, 
  MoreHorizontal, MessageSquare, Calendar, Paperclip, 
  Layers, ChevronDown, X, Check, User
} from 'lucide-react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // View Controls
  const [groupBy, setGroupBy] = useState<'STATUS' | 'PRIORITY'>('STATUS');
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MY_TASKS' | 'HIGH_PRIORITY'>('ALL');
  
  // Drag & Drop
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // New Task Modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(Priority.MEDIUM);
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState(CURRENT_USER.id);

  // Filter tasks based on search query and active filter
  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilter === 'MY_TASKS') {
        // Mocking current user check - assuming CURRENT_USER.id matches assignee.id or name check
        result = result.filter(t => t.assignee.id === CURRENT_USER.id);
    } else if (activeFilter === 'HIGH_PRIORITY') {
        result = result.filter(t => t.priority === Priority.URGENT || t.priority === Priority.HIGH);
    }

    return result;
  }, [tasks, searchQuery, activeFilter]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, groupValue: string) => {
    e.preventDefault();
    const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
    
    if (taskId) {
      setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        
        if (groupBy === 'STATUS') {
            return { ...t, status: groupValue as TaskStatus };
        } else {
            return { ...t, priority: groupValue as Priority };
        }
      }));
    }
    setDraggedTaskId(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assigneeEmp = EMPLOYEES.find(e => e.id === newTaskAssigneeId) || EMPLOYEES[0];

    const newTask: Task = {
        id: `new-${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDescription || 'No description provided',
        status: TaskStatus.TODO,
        priority: newTaskPriority,
        assignee: {
            id: assigneeEmp.id,
            name: `${assigneeEmp.firstName} ${assigneeEmp.lastName}`,
            avatar: assigneeEmp.imageUrl,
            role: assigneeEmp.role
        },
        dueDate: new Date().toISOString(),
        comments: 0,
        subtasksTotal: 0,
        subtasksCompleted: 0
    };

    setTasks([newTask, ...tasks]);
    setIsNewTaskModalOpen(false);
    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority(Priority.MEDIUM);
  };

  // Helper for Priority Badges
  const getPriorityBadge = (priority: Priority) => {
    const styles = {
      [Priority.URGENT]: 'bg-red-50 text-red-600 border-red-100',
      [Priority.HIGH]: 'bg-orange-50 text-orange-600 border-orange-100',
      [Priority.MEDIUM]: 'bg-blue-50 text-blue-600 border-blue-100',
      [Priority.LOW]: 'bg-slate-50 text-slate-600 border-slate-100',
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const Column = ({ title, groupValue }: { title: string, groupValue: string }) => {
    const columnTasks = filteredTasks.filter(t => {
        if (groupBy === 'STATUS') return t.status === groupValue;
        return t.priority === groupValue;
    });
    
    return (
      <div 
        className="flex flex-col h-full min-w-[280px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, groupValue)}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {columnTasks.length}
            </span>
          </div>
          <button 
            onClick={() => {
                setIsNewTaskModalOpen(true);
                // Optionally pre-set status if needed, but for now just open generic modal
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Drop Zone Area */}
        <div className={`flex-1 rounded-xl transition-colors duration-200 ${draggedTaskId ? 'bg-slate-50/50 border-2 border-dashed border-slate-200' : ''}`}>
          <div className="space-y-3 pb-4">
            {columnTasks.map(task => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative"
              >
                {/* Priority & Options */}
                <div className="flex justify-between items-start mb-3">
                  {getPriorityBadge(task.priority)}
                  <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                {/* Content */}
                <h4 className="text-sm font-semibold text-slate-900 mb-1 leading-snug">{task.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                
                {/* Footer info */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <img 
                        src={task.assignee.avatar} 
                        alt={task.assignee.name} 
                        className="w-6 h-6 rounded-full border border-slate-100"
                        title={task.assignee.name}
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-400">
                    {task.subtasksTotal > 0 && (
                        <div className="flex items-center text-xs">
                            <Paperclip size={12} className="mr-1" />
                            <span>{task.subtasksCompleted}/{task.subtasksTotal}</span>
                        </div>
                    )}
                    <div className="flex items-center text-xs">
                        <MessageSquare size={12} className="mr-1" />
                        <span>{task.comments}</span>
                    </div>
                    <div className="flex items-center text-xs">
                        <Calendar size={12} className="mr-1" />
                        <span>{new Date(task.dueDate).getDate()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Create New Task</h3>
                    <button onClick={() => setIsNewTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleCreateTask} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                        <input 
                            type="text" 
                            required
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="e.g. Redesign Homepage" 
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Add details..." 
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select 
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {Object.values(Priority).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                            <select 
                                value={newTaskAssigneeId}
                                onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                {EMPLOYEES.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsNewTaskModalOpen(false)}
                            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Task Board</h2>
          <p className="text-slate-500 text-sm mt-1">Manage projects, track time, and meet deadlines.</p>
        </div>
        <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors w-fit"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tasks by name..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
            />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto">
            {/* Filter Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className={`flex items-center px-3 py-2 border rounded-lg text-sm transition-colors whitespace-nowrap ${
                        activeFilter !== 'ALL' 
                        ? 'bg-primary-50 border-primary-200 text-primary-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter {activeFilter !== 'ALL' && `(${activeFilter === 'MY_TASKS' ? 'My Tasks' : 'High Priority'})`}
                    <ChevronDown className="w-3 h-3 ml-2 text-slate-400" />
                </button>

                {isFilterMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsFilterMenuOpen(false)}></div>
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                            <button 
                                onClick={() => { setActiveFilter('ALL'); setIsFilterMenuOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                            >
                                All Tasks
                                {activeFilter === 'ALL' && <Check className="w-3 h-3 text-primary-600" />}
                            </button>
                            <button 
                                onClick={() => { setActiveFilter('MY_TASKS'); setIsFilterMenuOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                            >
                                My Tasks
                                {activeFilter === 'MY_TASKS' && <Check className="w-3 h-3 text-primary-600" />}
                            </button>
                            <button 
                                onClick={() => { setActiveFilter('HIGH_PRIORITY'); setIsFilterMenuOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 flex justify-between items-center"
                            >
                                High Priority
                                {activeFilter === 'HIGH_PRIORITY' && <Check className="w-3 h-3 text-primary-600" />}
                            </button>
                        </div>
                    </>
                )}
            </div>
            
            {/* Group By Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsGroupMenuOpen(!isGroupMenuOpen)}
                    className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap"
                >
                    <Layers className="w-4 h-4 mr-2" />
                    Group By: {groupBy === 'STATUS' ? 'Status' : 'Priority'}
                    <ChevronDown className="w-3 h-3 ml-2 text-slate-400" />
                </button>
                
                {isGroupMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsGroupMenuOpen(false)}></div>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                            <button 
                                onClick={() => { setGroupBy('STATUS'); setIsGroupMenuOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${groupBy === 'STATUS' ? 'text-primary-600 font-medium' : 'text-slate-600'}`}
                            >
                                Status
                            </button>
                            <button 
                                onClick={() => { setGroupBy('PRIORITY'); setIsGroupMenuOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${groupBy === 'PRIORITY' ? 'text-primary-600 font-medium' : 'text-slate-600'}`}
                            >
                                Priority
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1.5 bg-slate-100 rounded text-slate-900 shadow-sm">
                    <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50">
                    <List className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1000px] pb-4">
          {groupBy === 'STATUS' ? (
              <>
                <div className="flex-1 min-w-[280px]"><Column title="To Do" groupValue={TaskStatus.TODO} /></div>
                <div className="flex-1 min-w-[280px]"><Column title="In Progress" groupValue={TaskStatus.IN_PROGRESS} /></div>
                <div className="flex-1 min-w-[280px]"><Column title="In Review" groupValue={TaskStatus.REVIEW} /></div>
                <div className="flex-1 min-w-[280px]"><Column title="Done" groupValue={TaskStatus.DONE} /></div>
              </>
          ) : (
              <>
                <div className="flex-1 min-w-[280px]"><Column title="Urgent" groupValue={Priority.URGENT} /></div>
                <div className="flex-1 min-w-[280px]"><Column title="High" groupValue={Priority.HIGH} /></div>
                <div className="flex-1 min-w-[280px]"><Column title="Medium" groupValue={Priority.MEDIUM} /></div>
                <div className="flex-1 min-w-[280px]"><Column title="Low" groupValue={Priority.LOW} /></div>
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;