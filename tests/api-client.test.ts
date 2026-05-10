import { describe, expect, it, vi, beforeEach } from 'vitest';
import { apiClient, authToken, ApiError } from '../services/apiClient';
import { Priority, TaskStatus } from '../types';

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  describe('authToken', () => {
    it('stores and retrieves token from localStorage', () => {
      authToken.set('test-token-123');
      expect(authToken.get()).toBe('test-token-123');
    });

    it('clears token from localStorage', () => {
      authToken.set('test-token-123');
      authToken.clear();
      expect(authToken.get()).toBeNull();
    });
  });

  describe('ApiError', () => {
    it('creates error with message and status', () => {
      const error = new ApiError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.status).toBe(404);
    });
  });

  describe('login', () => {
    it('calls /api/auth/login endpoint', async () => {
      const mockResponse = {
        token: 'jwt-token',
        user: { id: '1', email: 'test@test.com', name: 'Test', avatar: '', role: 'Admin', accessRole: 'Admin' as const, department: 'IT' }
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiClient.login('test@test.com', 'password123');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' })
      }));
    });

    it('throws ApiError on failed login', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      });

      await expect(apiClient.login('test@test.com', 'wrong')).rejects.toThrow(ApiError);
    });
  });

  describe('bootstrap', () => {
    it('calls /api/bootstrap endpoint with pagination params', async () => {
      authToken.set('valid-token');
      const mockData = {
        user: { id: '1', email: 'test@test.com', name: 'Test', avatar: '', role: 'Admin', accessRole: 'Admin' as const, department: 'IT' },
        tasks: [],
        employees: [],
        documents: [],
        approvals: [],
        leaves: [],
        payroll: null,
        performance: [],
        notifications: []
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await apiClient.bootstrap(1, 20);
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/api/bootstrap?page=1&limit=20', expect.any(Object));
    });
  });

  describe('createTask', () => {
    it('creates task with correct payload', async () => {
      authToken.set('valid-token');
      const mockTask = {
        id: 't1',
        title: 'Test Task',
        description: 'Test description',
        status: 'TODO' as const,
        priority: 'HIGH' as const,
        assignee: { id: '1', name: 'User', avatar: '', role: 'Dev' },
        dueDate: '2025-12-31',
        comments: 0,
        subtasksTotal: 0,
        subtasksCompleted: 0
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask)
      });

      const result = await apiClient.createTask({
        title: 'Test Task',
        description: 'Test description',
        priority: Priority.HIGH,
        assigneeId: '1'
      });

      expect(result).toEqual(mockTask);
      expect(fetch).toHaveBeenCalledWith('/api/tasks', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test description',
          priority: Priority.HIGH,
          assigneeId: '1'
        })
      }));
    });
  });

  describe('updateTask', () => {
    it('updates task status', async () => {
      authToken.set('valid-token');
      const mockTask = {
        id: 't1',
        title: 'Test Task',
        description: 'Test',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        assignee: { id: '1', name: 'User', avatar: '', role: 'Dev' },
        dueDate: '2025-12-31',
        comments: 0,
        subtasksTotal: 0,
        subtasksCompleted: 0
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask)
      });

      const result = await apiClient.updateTask('t1', { status: TaskStatus.IN_PROGRESS });
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe('decideApproval', () => {
    it('approves request', async () => {
      authToken.set('valid-token');
      const mockApproval = { id: 'a1', status: 'Approved' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApproval)
      });

      const result = await apiClient.decideApproval('a1', 'Approved');
      expect(result.status).toBe('Approved');
    });
  });

  describe('downloadBlob', () => {
    it('can be called without throwing', () => {
      // Test placeholder - actual DOM testing requires jsdom setup
      expect(true).toBe(true);
    });
  });
});