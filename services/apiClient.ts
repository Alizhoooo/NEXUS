import { ApprovalRequest, AuthUser, BootstrapData, Document, Employee, LeaveRequest, PayrollRecord, Priority, Task, TaskStatus } from '../types';

const TOKEN_KEY = 'nexus.auth.token';

type ViteImportMeta = ImportMeta & { env?: { VITE_API_BASE_URL?: string } };

const API_BASE_URL = ((import.meta as ViteImportMeta).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiUrl = (path: string): string => `${API_BASE_URL}${path}`;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export const authToken = {
  get: () => window.localStorage.getItem(TOKEN_KEY),
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY)
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(payload.message || response.statusText, response.status);
  }
  return response.json() as Promise<T>;
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const token = authToken.get();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(apiUrl(path), { ...init, headers });
  return parseResponse<T>(response);
};

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const apiClient = {
  login: (email: string, password: string) => request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  me: () => request<{ user: AuthUser }>('/api/auth/me'),
  bootstrap: (page = 1, limit = 20) => request<BootstrapData>(`/api/bootstrap?page=${page}&limit=${limit}`),
  getEmployees: (page = 1, limit = 20, search = '') => request<{ data: Employee[]; pagination: import('../types').PaginationInfo }>(`/api/employees?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
  createTask: (payload: { title: string; description: string; priority: Priority; assigneeId: string }) => request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateTask: (id: string, payload: { status?: TaskStatus; priority?: Priority }) => request<Task>(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  }),
  decideApproval: (id: string, status: ApprovalRequest['status']) => request<ApprovalRequest>(`/api/approvals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  decideLeave: (id: string, status: LeaveRequest['status']) => request<LeaveRequest>(`/api/leaves/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  uploadDocument: (payload: { name: string; type: string; size: string }) => request<Document>('/api/documents', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  downloadDocument: async (id: string): Promise<Blob> => {
    const token = authToken.get();
    const response = await fetch(apiUrl(`/api/documents/${id}/download`), { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
    if (!response.ok) throw new ApiError(response.statusText, response.status);
    return response.blob();
  },
  exportPayroll: async (): Promise<Blob> => {
    const token = authToken.get();
    const response = await fetch(apiUrl('/api/payroll/export'), { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
    if (!response.ok) throw new ApiError(response.statusText, response.status);
    return response.blob();
  },
  askAssistant: (message: string, history: { role: 'user' | 'model'; text: string }[]) => request<{ text: string }>('/api/assistant', {
    method: 'POST',
    body: JSON.stringify({ message, history })
  })
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export type PayrollExport = PayrollRecord[];
