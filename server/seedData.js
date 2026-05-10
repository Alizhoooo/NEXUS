// Legacy seed data - no longer used with PostgreSQL
// Use prisma/seed.js instead for database seeding

export const seedUsers = [];
export const seedData = { employees: [], tasks: [], documents: [], approvals: [], payroll: [], leaves: [], performance: [], notifications: [], auditEvents: [] };

export const SENSITIVE_ROLES = new Set(['Admin', 'HR', 'Finance']);
export const APPROVER_ROLES = new Set(['Admin', 'HR', 'Manager']);