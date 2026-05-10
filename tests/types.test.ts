import { describe, expect, it } from 'vitest';
import { TaskStatus, Priority, ViewType, Role } from '../types';

describe('TypeScript Types', () => {
  describe('ViewType', () => {
    it('has all required view types', () => {
      expect(ViewType.DASHBOARD).toBe('DASHBOARD');
      expect(ViewType.TASKS).toBe('TASKS');
      expect(ViewType.APPROVALS).toBe('APPROVALS');
      expect(ViewType.EMPLOYEES).toBe('EMPLOYEES');
      expect(ViewType.PAYROLL).toBe('PAYROLL');
      expect(ViewType.LEAVES).toBe('LEAVES');
      expect(ViewType.PERFORMANCE).toBe('PERFORMANCE');
      expect(ViewType.DOCUMENTS).toBe('DOCUMENTS');
      expect(ViewType.WIKI).toBe('WIKI');
      expect(ViewType.ASSISTANT).toBe('ASSISTANT');
    });
  });

  describe('TaskStatus', () => {
    it('has all required task statuses', () => {
      expect(TaskStatus.TODO).toBe('TODO');
      expect(TaskStatus.IN_PROGRESS).toBe('IN_PROGRESS');
      expect(TaskStatus.REVIEW).toBe('REVIEW');
      expect(TaskStatus.DONE).toBe('DONE');
    });
  });

  describe('Priority', () => {
    it('has all required priority levels', () => {
      expect(Priority.LOW).toBe('LOW');
      expect(Priority.MEDIUM).toBe('MEDIUM');
      expect(Priority.HIGH).toBe('HIGH');
      expect(Priority.URGENT).toBe('URGENT');
    });
  });

  describe('Role', () => {
    it('defines role types correctly', () => {
      const roles: Role[] = ['Admin', 'HR', 'Finance', 'Manager', 'Employee'];
      expect(roles).toContain('Admin');
      expect(roles).toContain('HR');
      expect(roles).toContain('Finance');
      expect(roles).toContain('Manager');
      expect(roles).toContain('Employee');
    });
  });
});