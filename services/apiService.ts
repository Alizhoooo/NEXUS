/**
 * API Service - Proxy for secure backend communication
 * 
 * IMPORTANT: In production, all API calls should go through your backend server.
 * Never expose API keys or sensitive data on the frontend.
 * 
 * Example backend endpoints:
 * - POST /api/auth/login
 * - GET /api/tasks
 * - POST /api/ai/generate
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('nexus_token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('nexus_user');
        localStorage.removeItem('nexus_token');
        window.location.reload();
        throw new Error('Unauthorized');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  logout: () => 
    apiRequest<void>('/auth/logout', { method: 'POST' }),
  
  refreshToken: () => 
    apiRequest<{ token: string }>('/auth/refresh', { method: 'POST' }),
};

// Tasks API
export const tasksAPI = {
  getAll: (filters?: Record<string, any>) => 
    apiRequest<any[]>('/tasks', {
      method: 'GET',
    }),
  
  getById: (id: string) => 
    apiRequest<any>(`/tasks/${id}`),
  
  create: (task: Partial<any>) => 
    apiRequest<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  
  update: (id: string, task: Partial<any>) => 
    apiRequest<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
  
  delete: (id: string) => 
    apiRequest<void>(`/tasks/${id}`, { method: 'DELETE' }),
};

// Employees API
export const employeesAPI = {
  getAll: () => apiRequest<any[]>('/employees'),
  getById: (id: string) => apiRequest<any>(`/employees/${id}`),
  create: (employee: Partial<any>) => 
    apiRequest<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    }),
  update: (id: string, employee: Partial<any>) => 
    apiRequest<any>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    }),
};

// AI API - Secure proxy to Gemini/LLM services
export const aiAPI = {
  generate: (prompt: string, context?: string) => 
    apiRequest<{ response: string }>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, context }),
    }),
  
  streamGenerate: async (
    prompt: string, 
    context: string,
    onChunk: (text: string) => void
  ) => {
    const token = localStorage.getItem('nexus_token');
    
    const response = await fetch(`${API_BASE_URL}/ai/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ prompt, context }),
    });
    
    if (!response.ok) {
      throw new Error('AI service unavailable');
    }
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');
    
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  },
  
  getSuggestions: (context: string, data?: any) => 
    apiRequest<any[]>('/ai/suggestions', {
      method: 'POST',
      body: JSON.stringify({ context, data }),
    }),
};

// Workflow/Automation API
export const workflowAPI = {
  getAll: () => apiRequest<any[]>('/workflows'),
  create: (workflow: Partial<any>) => 
    apiRequest<any>('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    }),
  trigger: (id: string, params?: any) => 
    apiRequest<any>(`/workflows/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};

export default apiRequest;
