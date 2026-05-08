export const seedUsers = [
  {
    id: 'u1',
    email: 'admin@kolesa.kz',
    password: 'nexus-demo',
    name: 'Марат Алиев',
    role: 'CTO',
    accessRole: 'Admin',
    department: 'Executive',
    avatar: 'https://picsum.photos/id/1005/100/100'
  },
  {
    id: 'u7',
    email: 'hr@kolesa.kz',
    password: 'nexus-hr',
    name: 'Сауле Бектурганова',
    role: 'HR Manager',
    accessRole: 'HR',
    department: 'HR',
    avatar: 'https://picsum.photos/id/180/100/100'
  },
  {
    id: 'u10',
    email: 'finance@kolesa.kz',
    password: 'nexus-finance',
    name: 'Данияр Оспанов',
    role: 'Finance Ops',
    accessRole: 'Finance',
    department: 'Finance',
    avatar: 'https://picsum.photos/id/1062/100/100'
  }
];

export const seedData = {
  employees: [
    { id: '1', firstName: 'Марат', lastName: 'Алиев', email: 'm.aliyev@kolesa.kz', role: 'CTO', department: 'Executive', status: 'Active', imageUrl: 'https://picsum.photos/id/1005/200/200', workload: 95, location: 'Almaty, HQ' },
    { id: '2', firstName: 'Асет', lastName: 'Нурмагамбетов', email: 'a.nurmag@kolesa.kz', role: 'Tech Lead', department: 'Engineering', status: 'Active', imageUrl: 'https://picsum.photos/id/1012/200/200', workload: 88, managerId: '1', location: 'Almaty, HQ' },
    { id: '3', firstName: 'Динара', lastName: 'Куанышева', email: 'd.kuan@kolesa.kz', role: 'Product Manager', department: 'Product', status: 'Active', imageUrl: 'https://picsum.photos/id/1027/200/200', workload: 92, managerId: '1', location: 'Almaty, HQ' },
    { id: '4', firstName: 'Тимур', lastName: 'Сериков', email: 't.serikov@kolesa.kz', role: 'Senior iOS Developer', department: 'Mobile', status: 'Active', imageUrl: 'https://picsum.photos/id/1009/200/200', workload: 90, managerId: '2', location: 'Astana, Remote' },
    { id: '5', firstName: 'Айгерим', lastName: 'Токтарова', email: 'a.toktarova@kolesa.kz', role: 'Lead Designer', department: 'Design', status: 'On Leave', imageUrl: 'https://picsum.photos/id/338/200/200', workload: 0, managerId: '3', location: 'Almaty, HQ' },
    { id: '6', firstName: 'Нурлан', lastName: 'Джексенов', email: 'n.jack@kolesa.kz', role: 'Backend Developer', department: 'Engineering', status: 'Active', imageUrl: 'https://picsum.photos/id/201/200/200', workload: 75, managerId: '2', location: 'Almaty, HQ' },
    { id: '7', firstName: 'Сауле', lastName: 'Бектурганова', email: 's.bek@kolesa.kz', role: 'HR Manager', department: 'HR', status: 'Remote', imageUrl: 'https://picsum.photos/id/180/200/200', workload: 60, managerId: '1', location: 'Shymkent, Remote' },
    { id: '8', firstName: 'Ерлан', lastName: 'Жумабеков', email: 'e.zhum@kolesa.kz', role: 'QA Lead', department: 'QA', status: 'Active', imageUrl: 'https://picsum.photos/id/152/200/200', workload: 85, managerId: '2', location: 'Almaty, HQ' },
    { id: '9', firstName: 'Алия', lastName: 'Исмаилова', email: 'a.ism@kolesa.kz', role: 'Frontend Developer', department: 'Engineering', status: 'Active', imageUrl: 'https://picsum.photos/id/449/200/200', workload: 70, managerId: '2', location: 'Almaty, HQ' },
    { id: '10', firstName: 'Данияр', lastName: 'Оспанов', email: 'd.ospanov@kolesa.kz', role: 'DevOps Engineer', department: 'DevOps', status: 'Active', imageUrl: 'https://picsum.photos/id/1062/200/200', workload: 80, managerId: '1', location: 'Almaty, HQ' }
  ],
  tasks: [
    { id: 't1', title: 'Редизайн карточки Kolesa.kz', description: 'Обновить UI карточки авто в листинге', status: 'IN_PROGRESS', priority: 'HIGH', assignee: { id: '9', name: 'Алия Исмаилова', avatar: 'https://picsum.photos/id/449/200/200', role: 'Frontend' }, dueDate: '2025-12-25', comments: 12, subtasksTotal: 5, subtasksCompleted: 3 },
    { id: 't2', title: 'Krisha.kz Map Optimization', description: 'Оптимизация рендеринга меток на карте', status: 'REVIEW', priority: 'MEDIUM', assignee: { id: '4', name: 'Тимур Сериков', avatar: 'https://picsum.photos/id/1009/200/200', role: 'iOS' }, dueDate: '2025-12-28', comments: 4, subtasksTotal: 3, subtasksCompleted: 3 },
    { id: 't3', title: 'Интеграция с Kaspi Pay', description: 'Добавить метод оплаты Kaspi QR', status: 'TODO', priority: 'URGENT', assignee: { id: '6', name: 'Нурлан Джексенов', avatar: 'https://picsum.photos/id/201/200/200', role: 'Backend' }, dueDate: '2025-12-20', comments: 28, subtasksTotal: 10, subtasksCompleted: 1 },
    { id: 't4', title: 'Market.kz Search API', description: 'Переход на Elasticsearch v8', status: 'DONE', priority: 'HIGH', assignee: { id: '10', name: 'Данияр Оспанов', avatar: 'https://picsum.photos/id/1062/200/200', role: 'DevOps' }, dueDate: '2025-12-10', comments: 8, subtasksTotal: 4, subtasksCompleted: 4 },
    { id: 't5', title: 'Q4 OKR Planning', description: 'Подготовка целей на следующий квартал', status: 'IN_PROGRESS', priority: 'HIGH', assignee: { id: '1', name: 'Марат Алиев', avatar: 'https://picsum.photos/id/1005/200/200', role: 'CTO' }, dueDate: '2025-12-30', comments: 45, subtasksTotal: 6, subtasksCompleted: 2 }
  ],
  documents: [
    { id: 'd1', name: 'OKR_2025_Q4.pdf', type: 'PDF', size: '2.4 MB', updatedAt: '2 hours ago', author: 'Марат Алиев' },
    { id: 'd2', name: 'Employee_Handbook.docx', type: 'DOCX', size: '1.1 MB', updatedAt: '1 day ago', author: 'Сауле Бектурганова' },
    { id: 'd3', name: 'Kolesa_API_v3.json', type: 'JSON', size: '450 KB', updatedAt: '3 days ago', author: 'Асет Нурмагамбетов' }
  ],
  approvals: [
    { id: 'ap1', type: 'Leave', requestor: 'Айгерим Токтарова', avatar: 'https://picsum.photos/id/338/200/200', details: 'Annual Leave (14 days)', date: 'Dec 15, 2025', status: 'Pending' },
    { id: 'ap2', type: 'Expense', requestor: 'Тимур Сериков', avatar: 'https://picsum.photos/id/1009/200/200', details: 'JetBrains License Renewal', amount: '₸ 85,000', date: 'Dec 18, 2025', status: 'Pending' },
    { id: 'ap3', type: 'Access', requestor: 'Нурлан Джексенов', avatar: 'https://picsum.photos/id/201/200/200', details: 'AWS Production Access', date: 'Dec 19, 2025', status: 'Pending' }
  ],
  payroll: [
    { id: 'pr1', employeeId: '2', employeeName: 'Асет Нурмагамбетов', avatar: 'https://picsum.photos/id/1012/200/200', department: 'Engineering', baseSalary: 1800000, bonus: 200000, deductions: 180000, netSalary: 1820000, currency: '₸', period: 'December 2025', status: 'Processing' },
    { id: 'pr2', employeeId: '4', employeeName: 'Тимур Сериков', avatar: 'https://picsum.photos/id/1009/200/200', department: 'Mobile', baseSalary: 1500000, bonus: 150000, deductions: 150000, netSalary: 1500000, currency: '₸', period: 'December 2025', status: 'Processing' },
    { id: 'pr3', employeeId: '6', employeeName: 'Нурлан Джексенов', avatar: 'https://picsum.photos/id/201/200/200', department: 'Engineering', baseSalary: 1200000, bonus: 100000, deductions: 120000, netSalary: 1180000, currency: '₸', period: 'December 2025', status: 'Processing' }
  ],
  leaves: [
    { id: 'l1', employeeId: '5', employeeName: 'Айгерим Токтарова', avatar: 'https://picsum.photos/id/338/200/200', type: 'Отпуск', startDate: '2025-12-15', endDate: '2025-12-29', days: 14, reason: 'Annual planned leave', status: 'Pending' },
    { id: 'l2', employeeId: '8', employeeName: 'Ерлан Жумабеков', avatar: 'https://picsum.photos/id/152/200/200', type: 'Больничный', startDate: '2025-12-01', endDate: '2025-12-05', days: 5, reason: 'Flu', status: 'Approved', approver: 'Сауле Бектурганова' }
  ],
  performance: [
    { id: 'pf1', employeeId: '2', employeeName: 'Асет Нурмагамбетов', avatar: 'https://picsum.photos/id/1012/200/200', role: 'Tech Lead', department: 'Engineering', overallScore: 4.8, metrics: { productivity: 95, quality: 98, teamwork: 90, communication: 85, initiative: 92 }, strengths: ['Technical Architecture', 'Code Quality', 'Mentoring'], improvements: ['Public Speaking'], goals: ['Launch Microservices'], reviewDate: '2025-11-30', reviewer: 'Марат Алиев' },
    { id: 'pf2', employeeId: '9', employeeName: 'Алия Исмаилова', avatar: 'https://picsum.photos/id/449/200/200', role: 'Frontend Dev', department: 'Engineering', overallScore: 4.2, metrics: { productivity: 90, quality: 85, teamwork: 95, communication: 90, initiative: 75 }, strengths: ['UI Implementation', 'Team Collaboration'], improvements: ['Testing Coverage'], goals: ['Master React 19'], reviewDate: '2025-11-30', reviewer: 'Асет Нурмагамбетов' }
  ],
  notifications: [
    { id: 'n1', title: 'Approval queue', description: '3 requests require review', createdAt: new Date().toISOString(), read: false },
    { id: 'n2', title: 'Security', description: 'Gemini requests are proxied server-side', createdAt: new Date().toISOString(), read: false }
  ],
  auditEvents: []
};
