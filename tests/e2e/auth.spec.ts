import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('shows login page for unauthenticated user', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@kolesa.kz');
    await page.fill('input[type="password"]', 'nexus-demo');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/');

    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@kolesa.kz');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[type="email"]', 'admin@kolesa.kz');
    await page.fill('input[type="password"]', 'nexus-demo');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
  });

  test('loads dashboard with correct elements', async ({ page }) => {
    await expect(page.locator('text=Task Board')).toBeVisible();
    await expect(page.locator('text=Employees')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.click('text=Employees');
    await expect(page.locator('text=Employees')).toBeVisible();

    await page.click('text=Tasks');
    await expect(page.locator('text=Task Board')).toBeVisible();
  });

  test('sidebar navigation shows all menu items', async ({ page }) => {
    await expect(page.locator('text=Approvals')).toBeVisible();
    await expect(page.locator('text=Payroll')).toBeVisible();
    await expect(page.locator('text=Wiki')).toBeVisible();
  });
});

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[type="email"]', 'admin@kolesa.kz');
    await page.fill('input[type="password"]', 'nexus-demo');
    await page.click('button[type="submit"]');
    await page.click('text=Tasks');
  });

  test('task board displays columns', async ({ page }) => {
    await expect(page.locator('text=To Do')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=In Review')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();
  });

  test('can create new task', async ({ page }) => {
    await page.click('text=New Task');

    await page.fill('input[placeholder*="Redesign"]', 'Test Task E2E');
    await page.fill('textarea', 'Test description');

    await page.click('button:has-text("Create Task")');

    await expect(page.locator('text=Task created through the secured API')).toBeVisible();
  });
});

test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[type="email"]', 'admin@kolesa.kz');
    await page.fill('input[type="password"]', 'nexus-demo');
    await page.click('button[type="submit"]');
  });

  test('AI Assistant opens and accepts input', async ({ page }) => {
    await page.click('text=AI Assistant');

    await expect(page.locator('textarea[placeholder*="Ask"]')).toBeVisible();

    await page.fill('textarea[placeholder*="Ask"]', 'Hello');
    await page.click('button:has-text("Send")');

    await expect(page.locator('text=AI proxy работает в демо-режиме')).toBeVisible({ timeout: 10000 });
  });
});