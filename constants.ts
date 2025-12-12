import { Employee, Task, TaskStatus, Priority, Document, ApprovalRequest, PayrollRecord, PerformanceReview, LeaveRequest } from './types';

export const CURRENT_USER = {
  id: 'u1',
  name: 'Марат Алиев',
  role: 'CTO',
  avatar: 'https://picsum.photos/id/1005/100/100'
};

export const EMPLOYEES: Employee[] = [
  { id: '1', firstName: 'Марат', lastName: 'Алиев', email: 'm.aliyev@kolesa.kz', role: 'CTO', department: 'Executive', status: 'Active', imageUrl: 'https://picsum.photos/id/1005/200/200', workload: 95, location: 'Almaty, HQ' },
  { id: '2', firstName: 'Асет', lastName: 'Нурмагамбетов', email: 'a.nurmag@kolesa.kz', role: 'Tech Lead', department: 'Engineering', status: 'Active', imageUrl: 'https://picsum.photos/id/1012/200/200', workload: 88, managerId: '1', location: 'Almaty, HQ' },
  { id: '3', firstName: 'Динара', lastName: 'Куанышева', email: 'd.kuan@kolesa.kz', role: 'Product Manager', department: 'Product', status: 'Active', imageUrl: 'https://picsum.photos/id/1027/200/200', workload: 92, managerId: '1', location: 'Almaty, HQ' },
  { id: '4', firstName: 'Тимур', lastName: 'Сериков', email: 't.serikov@kolesa.kz', role: 'Senior iOS Developer', department: 'Mobile', status: 'Active', imageUrl: 'https://picsum.photos/id/1009/200/200', workload: 90, managerId: '2', location: 'Astana, Remote' },
  { id: '5', firstName: 'Айгерим', lastName: 'Токтарова', email: 'a.toktarova@kolesa.kz', role: 'Lead Designer', department: 'Design', status: 'On Leave', imageUrl: 'https://picsum.photos/id/338/200/200', workload: 0, managerId: '3', location: 'Almaty, HQ' },
  { id: '6', firstName: 'Нурлан', lastName: 'Джексенов', email: 'n.jack@kolesa.kz', role: 'Backend Developer', department: 'Engineering', status: 'Active', imageUrl: 'https://picsum.photos/id/201/200/200', workload: 75, managerId: '2', location: 'Almaty, HQ' },
  { id: '7', firstName: 'Сауле', lastName: 'Бектурганова', email: 's.bek@kolesa.kz', role: 'HR Manager', department: 'HR', status: 'Remote', imageUrl: 'https://picsum.photos/id/180/200/200', workload: 60, managerId: '1', location: 'Shymkent, Remote' },
  { id: '8', firstName: 'Ерлан', lastName: 'Жумабеков', email: 'e.zhum@kolesa.kz', role: 'QA Lead', department: 'QA', status: 'Active', imageUrl: 'https://picsum.photos/id/152/200/200', workload: 85, managerId: '2', location: 'Almaty, HQ' },
  { id: '9', firstName: 'Алия', lastName: 'Исмаилова', email: 'a.ism@kolesa.kz', role: 'Frontend Developer', department: 'Engineering', status: 'Active', imageUrl: 'https://picsum.photos/id/449/200/200', workload: 70, managerId: '2', location: 'Almaty, HQ' },
  { id: '10', firstName: 'Данияр', lastName: 'Оспанов', email: 'd.ospanov@kolesa.kz', role: 'DevOps Engineer', department: 'DevOps', status: 'Active', imageUrl: 'https://picsum.photos/id/1062/200/200', workload: 80, managerId: '1', location: 'Almaty, HQ' },
];

export const TASKS: Task[] = [
  { id: 't1', title: 'Редизайн карточки Kolesa.kz', description: 'Обновить UI карточки авто в листинге', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assignee: { id: '9', name: 'Алия Исмаилова', avatar: EMPLOYEES[8].imageUrl, role: 'Frontend' }, dueDate: '2025-12-25', comments: 12, subtasksTotal: 5, subtasksCompleted: 3 },
  { id: 't2', title: 'Krisha.kz Map Optimization', description: 'Оптимизация рендеринга меток на карте', status: TaskStatus.REVIEW, priority: Priority.MEDIUM, assignee: { id: '4', name: 'Тимур Сериков', avatar: EMPLOYEES[3].imageUrl, role: 'iOS' }, dueDate: '2025-12-28', comments: 4, subtasksTotal: 3, subtasksCompleted: 3 },
  { id: 't3', title: 'Интеграция с Kaspi Pay', description: 'Добавить метод оплаты Kaspi QR', status: TaskStatus.TODO, priority: Priority.URGENT, assignee: { id: '6', name: 'Нурлан Джексенов', avatar: EMPLOYEES[5].imageUrl, role: 'Backend' }, dueDate: '2025-12-20', comments: 28, subtasksTotal: 10, subtasksCompleted: 1 },
  { id: 't4', title: 'Market.kz Search API', description: 'Переход на Elasticsearch v8', status: TaskStatus.DONE, priority: Priority.HIGH, assignee: { id: '10', name: 'Данияр Оспанов', avatar: EMPLOYEES[9].imageUrl, role: 'DevOps' }, dueDate: '2025-12-10', comments: 8, subtasksTotal: 4, subtasksCompleted: 4 },
  { id: 't5', title: 'Q4 OKR Planning', description: 'Подготовка целей на следующий квартал', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assignee: { id: '1', name: 'Марат Алиев', avatar: EMPLOYEES[0].imageUrl, role: 'CTO' }, dueDate: '2025-12-30', comments: 45, subtasksTotal: 6, subtasksCompleted: 2 },
  { id: 't6', title: 'Design System Update', description: 'Добавить новые токены цветов', status: TaskStatus.TODO, priority: Priority.LOW, assignee: { id: '5', name: 'Айгерим Токтарова', avatar: EMPLOYEES[4].imageUrl, role: 'Design' }, dueDate: '2026-01-15', comments: 2, subtasksTotal: 2, subtasksCompleted: 0 },
  { id: 't7', title: 'Push Notifications Service', description: 'Рефакторинг сервиса уведомлений', status: TaskStatus.REVIEW, priority: Priority.MEDIUM, assignee: { id: '2', name: 'Асет Нурмагамбетов', avatar: EMPLOYEES[1].imageUrl, role: 'Tech Lead' }, dueDate: '2025-12-26', comments: 15, subtasksTotal: 8, subtasksCompleted: 7 },
  { id: 't8', title: 'Security Audit', description: 'Ежегодный аудит безопасности', status: TaskStatus.TODO, priority: Priority.URGENT, assignee: { id: '10', name: 'Данияр Оспанов', avatar: EMPLOYEES[9].imageUrl, role: 'DevOps' }, dueDate: '2025-12-22', comments: 0, subtasksTotal: 15, subtasksCompleted: 0 },
];

export const DOCUMENTS: Document[] = [
  { id: 'd1', name: 'OKR_2025_Q4.pdf', type: 'PDF', size: '2.4 MB', updatedAt: '2 hours ago', author: 'Марат Алиев' },
  { id: 'd2', name: 'Employee_Handbook.docx', type: 'DOCX', size: '1.1 MB', updatedAt: '1 day ago', author: 'Сауле Бектурганова' },
  { id: 'd3', name: 'Kolesa_API_v3.json', type: 'JSON', size: '450 KB', updatedAt: '3 days ago', author: 'Асет Нурмагамбетов' },
  { id: 'd4', name: 'Design_System_Colors.fig', type: 'FIGMA', size: '124 MB', updatedAt: '5 days ago', author: 'Айгерим Токтарова' },
  { id: 'd5', name: 'Mobile_Architecture.drawio', type: 'XML', size: '1.2 MB', updatedAt: '1 week ago', author: 'Тимур Сериков' },
  { id: 'd6', name: 'Onboarding_Checklist.xlsx', type: 'XLSX', size: '24 KB', updatedAt: '2 weeks ago', author: 'Сауле Бектурганова' },
];

export const APPROVALS: ApprovalRequest[] = [
  { id: 'ap1', type: 'Leave', requestor: 'Айгерим Токтарова', avatar: EMPLOYEES[4].imageUrl, details: 'Annual Leave (14 days)', date: 'Dec 15, 2025', status: 'Pending' },
  { id: 'ap2', type: 'Expense', requestor: 'Тимур Сериков', avatar: EMPLOYEES[3].imageUrl, details: 'JetBrains License Renewal', amount: '₸ 85,000', date: 'Dec 18, 2025', status: 'Pending' },
  { id: 'ap3', type: 'Access', requestor: 'Нурлан Джексенов', avatar: EMPLOYEES[5].imageUrl, details: 'AWS Production Access', date: 'Dec 19, 2025', status: 'Pending' },
  { id: 'ap4', type: 'Document', requestor: 'Сауле Бектурганова', avatar: EMPLOYEES[6].imageUrl, details: 'New Hiring Policy', date: 'Dec 20, 2025', status: 'Approved' },
  { id: 'ap5', type: 'Expense', requestor: 'Ерлан Жумабеков', avatar: EMPLOYEES[7].imageUrl, details: 'Team Building Event', amount: '₸ 150,000', date: 'Dec 10, 2025', status: 'Rejected' },
];

export const PAYROLL_DATA: PayrollRecord[] = [
  { id: 'pr1', employeeId: '2', employeeName: 'Асет Нурмагамбетов', avatar: EMPLOYEES[1].imageUrl, department: 'Engineering', baseSalary: 1800000, bonus: 200000, deductions: 180000, netSalary: 1820000, currency: '₸', period: 'December 2025', status: 'Processing' },
  { id: 'pr2', employeeId: '4', employeeName: 'Тимур Сериков', avatar: EMPLOYEES[3].imageUrl, department: 'Mobile', baseSalary: 1500000, bonus: 150000, deductions: 150000, netSalary: 1500000, currency: '₸', period: 'December 2025', status: 'Processing' },
  { id: 'pr3', employeeId: '6', employeeName: 'Нурлан Джексенов', avatar: EMPLOYEES[5].imageUrl, department: 'Backend', baseSalary: 1200000, bonus: 100000, deductions: 120000, netSalary: 1180000, currency: '₸', period: 'December 2025', status: 'Processing' },
  { id: 'pr4', employeeId: '9', employeeName: 'Алия Исмаилова', avatar: EMPLOYEES[8].imageUrl, department: 'Frontend', baseSalary: 1100000, bonus: 100000, deductions: 110000, netSalary: 1090000, currency: '₸', period: 'December 2025', status: 'Processing' },
  { id: 'pr5', employeeId: '7', employeeName: 'Сауле Бектурганова', avatar: EMPLOYEES[6].imageUrl, department: 'HR', baseSalary: 900000, bonus: 50000, deductions: 90000, netSalary: 860000, currency: '₸', period: 'December 2025', status: 'Paid' },
];

export const LEAVES: LeaveRequest[] = [
  { id: 'l1', employeeId: '5', employeeName: 'Айгерим Токтарова', avatar: EMPLOYEES[4].imageUrl, type: 'Отпуск', startDate: '2025-12-15', endDate: '2025-12-29', days: 14, reason: 'Annual planned leave', status: 'Pending' },
  { id: 'l2', employeeId: '8', employeeName: 'Ерлан Жумабеков', avatar: EMPLOYEES[7].imageUrl, type: 'Больничный', startDate: '2025-12-01', endDate: '2025-12-05', days: 5, reason: 'Flu', status: 'Approved' },
];

export const PERFORMANCE: PerformanceReview[] = [
  { 
    id: 'pf1', employeeId: '2', employeeName: 'Асет Нурмагамбетов', avatar: EMPLOYEES[1].imageUrl, role: 'Tech Lead', department: 'Engineering', overallScore: 4.8, 
    metrics: { productivity: 95, quality: 98, teamwork: 90, communication: 85, initiative: 92 },
    strengths: ['Technical Architecture', 'Code Quality', 'Mentoring'], improvements: ['Public Speaking'], goals: ['Launch Microservices'], reviewDate: '2025-11-30', reviewer: 'Марат Алиев'
  },
  { 
    id: 'pf2', employeeId: '9', employeeName: 'Алия Исмаилова', avatar: EMPLOYEES[8].imageUrl, role: 'Frontend Dev', department: 'Engineering', overallScore: 4.2, 
    metrics: { productivity: 90, quality: 85, teamwork: 95, communication: 90, initiative: 75 },
    strengths: ['UI Implementation', 'Team Collaboration'], improvements: ['Testing Coverage'], goals: ['Master React 19'], reviewDate: '2025-11-30', reviewer: 'Асет Нурмагамбетов'
  }
];