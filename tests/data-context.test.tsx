import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { DataProvider, useData } from '../contexts/DataContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ReactNode } from 'react';
import { Priority, TaskStatus } from '../types';

vi.mock('../services/apiClient', () => ({
  apiClient: {
    me: vi.fn().mockResolvedValue({ user: { id: '1', email: 'test@test.com', name: 'Test User', avatar: '', role: 'Admin', accessRole: 'Admin', department: 'IT' } }),
    bootstrap: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    decideApproval: vi.fn(),
    decideLeave: vi.fn(),
    uploadDocument: vi.fn()
  },
  authToken: {
    get: vi.fn(() => 'test-token')
  }
}));

import { apiClient, authToken } from '../services/apiClient';

const mockBootstrapData = {
  user: { id: '1', email: 'test@test.com', name: 'Test User', avatar: '', role: 'Admin', accessRole: 'Admin' as const, department: 'IT' },
  tasks: [{ id: 't1', title: 'Task 1', description: 'Desc', status: 'TODO' as const, priority: 'HIGH' as const, assignee: { id: '1', name: 'User', avatar: '', role: 'Dev' }, dueDate: '2025-12-31', comments: 0, subtasksTotal: 0, subtasksCompleted: 0 }],
  employees: [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', role: 'Dev', department: 'IT', status: 'Active', imageUrl: '', workload: 100 }],
  documents: [],
  approvals: [],
  leaves: [],
  payroll: null,
  performance: [],
  notifications: []
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <DataProvider>{children}</DataProvider>
  </AuthProvider>
);

describe('DataContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.bootstrap as ReturnType<typeof vi.fn>).mockResolvedValue(mockBootstrapData);
    (authToken.get as ReturnType<typeof vi.fn>).mockReturnValue('test-token');
  });

  it('loads data on mount', async () => {
    const { result } = renderHook(() => useData(), { wrapper });

    await waitFor(() => {
      expect(result.current.tasks.length).toBe(1);
      expect(result.current.employees.length).toBe(1);
    });
  });

  it('provides createTask function', async () => {
    const newTask = { id: 't2', title: 'New Task', description: 'Desc', status: 'TODO' as const, priority: 'MEDIUM' as const, assignee: { id: '1', name: 'User', avatar: '', role: 'Dev' }, dueDate: '2025-12-31', comments: 0, subtasksTotal: 0, subtasksCompleted: 0 };
    (apiClient.createTask as ReturnType<typeof vi.fn>).mockResolvedValue(newTask);

    const { result } = renderHook(() => useData(), { wrapper });

    await waitFor(() => expect(result.current.tasks.length).toBe(1));

    await act(async () => {
      await result.current.createTask({ title: 'New Task', description: 'Desc', priority: Priority.MEDIUM, assigneeId: '1' });
    });

    expect(apiClient.createTask).toHaveBeenCalledWith({ title: 'New Task', description: 'Desc', priority: Priority.MEDIUM, assigneeId: '1' });
  });

  it('provides updateTask function', async () => {
    const updatedTask = { ...mockBootstrapData.tasks[0], status: 'IN_PROGRESS' };
    (apiClient.updateTask as ReturnType<typeof vi.fn>).mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useData(), { wrapper });

    await waitFor(() => expect(result.current.tasks.length).toBe(1));

    await act(async () => {
      await result.current.updateTask('t1', { status: TaskStatus.IN_PROGRESS });
    });

    expect(apiClient.updateTask).toHaveBeenCalledWith('t1', { status: TaskStatus.IN_PROGRESS });
  });

  it('provides decideApproval function', async () => {
    const approved = { id: 'a1', status: 'Approved' };
    (apiClient.decideApproval as ReturnType<typeof vi.fn>).mockResolvedValue(approved);

    const { result } = renderHook(() => useData(), { wrapper });

    await act(async () => {
      await result.current.decideApproval('a1', 'Approved');
    });

    expect(apiClient.decideApproval).toHaveBeenCalledWith('a1', 'Approved');
  });

  it('provides decideLeave function', async () => {
    const approved = { id: 'l1', status: 'Approved' };
    (apiClient.decideLeave as ReturnType<typeof vi.fn>).mockResolvedValue(approved);

    const { result } = renderHook(() => useData(), { wrapper });

    await act(async () => {
      await result.current.decideLeave('l1', 'Approved');
    });

    expect(apiClient.decideLeave).toHaveBeenCalledWith('l1', 'Approved');
  });

  it('provides reload function', async () => {
    const { result } = renderHook(() => useData(), { wrapper });

    await waitFor(() => expect(result.current.tasks.length).toBe(1));

    await act(async () => {
      await result.current.reload();
    });

    expect(apiClient.bootstrap).toHaveBeenCalledTimes(2);
  });
});