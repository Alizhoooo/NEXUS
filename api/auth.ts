import { User } from '../types';

export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface AuthUser extends User {
  role: UserRole;
  email: string;
}

// Mock users database for demo with proper RBAC
export const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@kolesa.kz': {
    password: 'admin123',
    user: {
      id: 'u1',
      name: 'Марат Алиев',
      email: 'admin@kolesa.kz',
      role: 'Admin',
      avatar: 'https://picsum.photos/id/1005/100/100'
    }
  },
  'manager@kolesa.kz': {
    password: 'manager123',
    user: {
      id: 'u2',
      name: 'Асет Нурмагамбетов',
      email: 'manager@kolesa.kz',
      role: 'Manager',
      avatar: 'https://picsum.photos/id/1012/100/100'
    }
  },
  'employee@kolesa.kz': {
    password: 'employee123',
    user: {
      id: 'u3',
      name: 'Алия Исмаилова',
      email: 'employee@kolesa.kz',
      role: 'Employee',
      avatar: 'https://picsum.photos/id/449/100/100'
    }
  }
};

// Demo mode - accept any credentials but assign default role
export const authenticateUser = async (email: string, password: string): Promise<AuthUser | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check against mock users first
  const mockUser = MOCK_USERS[email.toLowerCase()];
  if (mockUser && mockUser.password === password) {
    return mockUser.user;
  }
  
  // Demo mode: allow any email/password but with Employee role
  // In production, this would be removed and only real users would be accepted
  if (email && password) {
    return {
      id: `demo-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'Employee',
      avatar: `https://picsum.photos/seed/${email}/100/100`
    };
  }
  
  return null;
};

// Permission checks based on roles
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    'Employee': 1,
    'Manager': 2,
    'Admin': 3
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canAccessAdminPanel = (userRole: UserRole): boolean => {
  return userRole === 'Admin';
};

export const canApproveRequests = (userRole: UserRole): boolean => {
  return userRole === 'Admin' || userRole === 'Manager';
};

export const canViewPayroll = (userRole: UserRole): boolean => {
  return userRole === 'Admin' || userRole === 'Manager';
};

export const canManageEmployees = (userRole: UserRole): boolean => {
  return userRole === 'Admin' || userRole === 'Manager';
};
