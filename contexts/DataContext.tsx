import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { ApprovalRequest, BootstrapData, Document, Employee, LeaveRequest, NotificationItem, PayrollRecord, PerformanceReview, Priority, Task, TaskStatus } from '../types';
import { useAuth } from './AuthContext';

interface DataContextValue {
  isLoading: boolean;
  error: string | null;
  tasks: Task[];
  employees: Employee[];
  documents: Document[];
  approvals: ApprovalRequest[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[] | null;
  performance: PerformanceReview[];
  notifications: NotificationItem[];
  reload: () => Promise<void>;
  createTask: (payload: { title: string; description: string; priority: Priority; assigneeId: string }) => Promise<void>;
  updateTask: (id: string, payload: { status?: TaskStatus; priority?: Priority }) => Promise<void>;
  decideApproval: (id: string, status: ApprovalRequest['status']) => Promise<void>;
  decideLeave: (id: string, status: LeaveRequest['status']) => Promise<void>;
  uploadDocument: (payload: { name: string; type: string; size: string }) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const emptyData: BootstrapData = {
  user: { id: '', email: '', name: '', avatar: '', role: '', accessRole: 'Employee', department: '' },
  tasks: [],
  employees: [],
  documents: [],
  approvals: [],
  leaves: [],
  payroll: null,
  performance: [],
  notifications: []
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<BootstrapData>(emptyData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextData = await apiClient.bootstrap();
      setData(nextData);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createTask = useCallback(async (payload: { title: string; description: string; priority: Priority; assigneeId: string }) => {
    const task = await apiClient.createTask(payload);
    setData((previous) => ({ ...previous, tasks: [task, ...previous.tasks] }));
  }, []);

  const updateTask = useCallback(async (id: string, payload: { status?: TaskStatus; priority?: Priority }) => {
    const task = await apiClient.updateTask(id, payload);
    setData((previous) => ({ ...previous, tasks: previous.tasks.map((item) => (item.id === id ? task : item)) }));
  }, []);

  const decideApproval = useCallback(async (id: string, status: ApprovalRequest['status']) => {
    const approval = await apiClient.decideApproval(id, status);
    setData((previous) => ({ ...previous, approvals: previous.approvals.map((item) => (item.id === id ? approval : item)) }));
  }, []);

  const decideLeave = useCallback(async (id: string, status: LeaveRequest['status']) => {
    const leave = await apiClient.decideLeave(id, status);
    setData((previous) => ({ ...previous, leaves: previous.leaves.map((item) => (item.id === id ? leave : item)) }));
  }, []);

  const uploadDocument = useCallback(async (payload: { name: string; type: string; size: string }) => {
    const document = await apiClient.uploadDocument(payload);
    setData((previous) => ({ ...previous, documents: [document, ...previous.documents] }));
  }, []);

  const value = useMemo<DataContextValue>(() => ({
    isLoading,
    error,
    tasks: data.tasks,
    employees: data.employees,
    documents: data.documents,
    approvals: data.approvals,
    leaves: data.leaves,
    payroll: data.payroll,
    performance: data.performance,
    notifications: data.notifications,
    reload,
    createTask,
    updateTask,
    decideApproval,
    decideLeave,
    uploadDocument
  }), [createTask, data, decideApproval, decideLeave, error, isLoading, reload, updateTask, uploadDocument]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
