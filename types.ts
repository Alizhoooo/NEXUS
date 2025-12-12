export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  APPROVALS = 'APPROVALS',
  EMPLOYEES = 'EMPLOYEES',
  PAYROLL = 'PAYROLL',
  LEAVES = 'LEAVES',
  PERFORMANCE = 'PERFORMANCE',
  DOCUMENTS = 'DOCUMENTS',
  WIKI = 'WIKI',
  ASSISTANT = 'ASSISTANT'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: User;
  dueDate: string;
  comments: number;
  subtasksTotal: number;
  subtasksCompleted: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Remote';
  imageUrl: string;
  workload: number; // 0-100 percentage
  managerId?: string;
  phone?: string;
  location?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  author: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ApprovalRequest {
  id: string;
  type: 'Leave' | 'Expense' | 'Access' | 'Document';
  requestor: string;
  avatar: string;
  details: string;
  amount?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  type: 'Отпуск' | 'Больничный' | 'Отгул' | 'Удалёнка';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  currency: string;
  period: string;
  status: 'Pending' | 'Paid' | 'Processing';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  role: string;
  department: string;
  overallScore: number; // 1-5
  metrics: {
    productivity: number;
    quality: number;
    teamwork: number;
    communication: number;
    initiative: number;
  };
  strengths: string[];
  improvements: string[];
  goals: string[];
  reviewDate: string;
  reviewer: string;
}