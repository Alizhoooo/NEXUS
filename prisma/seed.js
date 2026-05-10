import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hashedPassword = bcrypt.hashSync('nexus-demo', 10);
const hashedPasswordHR = bcrypt.hashSync('nexus-hr', 10);
const hashedPasswordFinance = bcrypt.hashSync('nexus-finance', 10);

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.auditEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.performance.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        id: 'u1',
        email: 'admin@kolesa.kz',
        password: hashedPassword,
        name: 'Марат Алиев',
        role: 'CTO',
        accessRole: 'Admin',
        department: 'Executive',
        avatar: 'https://picsum.photos/id/1005/100/100'
      },
      {
        id: 'u7',
        email: 'hr@kolesa.kz',
        password: hashedPasswordHR,
        name: 'Сауле Бектурганова',
        role: 'HR Manager',
        accessRole: 'HR',
        department: 'HR',
        avatar: 'https://picsum.photos/id/180/100/100'
      },
      {
        id: 'u10',
        email: 'finance@kolesa.kz',
        password: hashedPasswordFinance,
        name: 'Данияр Оспанов',
        role: 'Finance Ops',
        accessRole: 'Finance',
        department: 'Finance',
        avatar: 'https://picsum.photos/id/1062/100/100'
      }
    ]
  });

  // Seed Employees
  await prisma.employee.createMany({
    data: [
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
    ]
  });

  // Seed Tasks
  await prisma.task.createMany({
    data: [
      { id: 't1', title: 'Редизайн карточки Kolesa.kz', description: 'Обновить UI карточки авто в листинге', status: 'IN_PROGRESS', priority: 'HIGH', assigneeId: '9', assigneeName: 'Алия Исмаилова', assigneeAvatar: 'https://picsum.photos/id/449/200/200', assigneeRole: 'Frontend', dueDate: new Date('2025-12-25'), comments: 12, subtasksTotal: 5, subtasksCompleted: 3 },
      { id: 't2', title: 'Krisha.kz Map Optimization', description: 'Оптимизация рендеринга меток на карте', status: 'REVIEW', priority: 'MEDIUM', assigneeId: '4', assigneeName: 'Тимур Сериков', assigneeAvatar: 'https://picsum.photos/id/1009/200/200', assigneeRole: 'iOS', dueDate: new Date('2025-12-28'), comments: 4, subtasksTotal: 3, subtasksCompleted: 3 },
      { id: 't3', title: 'Интеграция с Kaspi Pay', description: 'Добавить метод оплаты Kaspi QR', status: 'TODO', priority: 'URGENT', assigneeId: '6', assigneeName: 'Нурлан Джексенов', assigneeAvatar: 'https://picsum.photos/id/201/200/200', assigneeRole: 'Backend', dueDate: new Date('2025-12-20'), comments: 28, subtasksTotal: 10, subtasksCompleted: 1 },
      { id: 't4', title: 'Market.kz Search API', description: 'Переход на Elasticsearch v8', status: 'DONE', priority: 'HIGH', assigneeId: '10', assigneeName: 'Данияр Оспанов', assigneeAvatar: 'https://picsum.photos/id/1062/200/200', assigneeRole: 'DevOps', dueDate: new Date('2025-12-10'), comments: 8, subtasksTotal: 4, subtasksCompleted: 4 },
      { id: 't5', title: 'Q4 OKR Planning', description: 'Подготовка целей на следующий квартал', status: 'IN_PROGRESS', priority: 'HIGH', assigneeId: '1', assigneeName: 'Марат Алиев', assigneeAvatar: 'https://picsum.photos/id/1005/200/200', assigneeRole: 'CTO', dueDate: new Date('2025-12-30'), comments: 45, subtasksTotal: 6, subtasksCompleted: 2 }
    ]
  });

  // Seed Documents
  await prisma.document.createMany({
    data: [
      { id: 'd1', name: 'OKR_2025_Q4.pdf', type: 'PDF', size: '2.4 MB', updatedAt: '2 hours ago', author: 'Марат Алиев' },
      { id: 'd2', name: 'Employee_Handbook.docx', type: 'DOCX', size: '1.1 MB', updatedAt: '1 day ago', author: 'Сауле Бектурганова' },
      { id: 'd3', name: 'Kolesa_API_v3.json', type: 'JSON', size: '450 KB', updatedAt: '3 days ago', author: 'Асет Нурмагамбетов' }
    ]
  });

  // Seed Approvals
  await prisma.approval.createMany({
    data: [
      { id: 'ap1', type: 'Leave', requestor: 'Айгерим Токтарова', avatar: 'https://picsum.photos/id/338/200/200', details: 'Annual Leave (14 days)', date: 'Dec 15, 2025', status: 'Pending' },
      { id: 'ap2', type: 'Expense', requestor: 'Тимур Сериков', avatar: 'https://picsum.photos/id/1009/200/200', details: 'JetBrains License Renewal', amount: '₸ 85,000', date: 'Dec 18, 2025', status: 'Pending' },
      { id: 'ap3', type: 'Access', requestor: 'Нурлан Джексенов', avatar: 'https://picsum.photos/id/201/200/200', details: 'AWS Production Access', date: 'Dec 19, 2025', status: 'Pending' }
    ]
  });

  // Seed Payroll
  await prisma.payroll.createMany({
    data: [
      { id: 'pr1', employeeId: '2', employeeName: 'Асет Нурмагамбетов', avatar: 'https://picsum.photos/id/1012/200/200', department: 'Engineering', baseSalary: 1800000, bonus: 200000, deductions: 180000, netSalary: 1820000, currency: '₸', period: 'December 2025', status: 'Processing' },
      { id: 'pr2', employeeId: '4', employeeName: 'Тимур Сериков', avatar: 'https://picsum.photos/id/1009/200/200', department: 'Mobile', baseSalary: 1500000, bonus: 150000, deductions: 150000, netSalary: 1500000, currency: '₸', period: 'December 2025', status: 'Processing' },
      { id: 'pr3', employeeId: '6', employeeName: 'Нурлан Джексенов', avatar: 'https://picsum.photos/id/201/200/200', department: 'Engineering', baseSalary: 1200000, bonus: 100000, deductions: 120000, netSalary: 1180000, currency: '₸', period: 'December 2025', status: 'Processing' }
    ]
  });

  // Seed Leaves
  await prisma.leave.createMany({
    data: [
      { id: 'l1', employeeId: '5', employeeName: 'Айгерим Токтарова', avatar: 'https://picsum.photos/id/338/200/200', type: 'Отпуск', startDate: '2025-12-15', endDate: '2025-12-29', days: 14, reason: 'Annual planned leave', status: 'Pending' },
      { id: 'l2', employeeId: '8', employeeName: 'Ерлан Жумабеков', avatar: 'https://picsum.photos/id/152/200/200', type: 'Больничный', startDate: '2025-12-01', endDate: '2025-12-05', days: 5, reason: 'Flu', status: 'Approved', approver: 'Сауле Бектурганова' }
    ]
  });

  // Seed Performance
  await prisma.performance.createMany({
    data: [
      { id: 'pf1', employeeId: '2', employeeName: 'Асет Нурмагамбетов', avatar: 'https://picsum.photos/id/1012/200/200', role: 'Tech Lead', department: 'Engineering', overallScore: 4.8, productivity: 95, quality: 98, teamwork: 90, communication: 85, initiative: 92, strengths: ['Technical Architecture', 'Code Quality', 'Mentoring'], improvements: ['Public Speaking'], goals: ['Launch Microservices'], reviewDate: '2025-11-30', reviewer: 'Марат Алиев' },
      { id: 'pf2', employeeId: '9', employeeName: 'Алия Исмаилова', avatar: 'https://picsum.photos/id/449/200/200', role: 'Frontend Dev', department: 'Engineering', overallScore: 4.2, productivity: 90, quality: 85, teamwork: 95, communication: 90, initiative: 75, strengths: ['UI Implementation', 'Team Collaboration'], improvements: ['Testing Coverage'], goals: ['Master React 19'], reviewDate: '2025-11-30', reviewer: 'Асет Нурмагамбетов' }
    ]
  });

  // Seed Notifications
  await prisma.notification.createMany({
    data: [
      { id: 'n1', title: 'Approval queue', description: '3 requests require review', createdAt: new Date().toISOString(), read: false },
      { id: 'n2', title: 'Security', description: 'Gemini requests are proxied server-side', createdAt: new Date().toISOString(), read: false }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });