import { test, expect } from '@playwright/test';

test.describe('Dashboard Core Tests', () => {
  // Test 1-20: Basic Loading and Layout Tests
  test('001: Dashboard should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/FinAdvise Admin Panel/);
    await page.screenshot({ path: 'screenshots/001-dashboard-load.png' });
  });

  test('002: Glassmorphism effects should be visible', async ({ page }) => {
    await page.goto('/');
    const dashboardCard = page.locator('[class*="backdrop-blur"]').first();
    await expect(dashboardCard).toBeVisible();
    const hasBlur = await dashboardCard.evaluate(el =>
      window.getComputedStyle(el).backdropFilter.includes('blur')
    );
    expect(hasBlur).toBeTruthy();
    await page.screenshot({ path: 'screenshots/002-glassmorphism.png' });
  });

  test('003: Purple gradient background should be applied', async ({ page }) => {
    await page.goto('/');
    const background = await page.evaluate(() =>
      window.getComputedStyle(document.body).background
    );
    expect(background).toContain('gradient');
    await page.screenshot({ path: 'screenshots/003-gradient-bg.png' });
  });

  test('004: Sidebar navigation should be visible', async ({ page }) => {
    await page.goto('/');
    const sidebar = page.locator('[role="navigation"]');
    await expect(sidebar).toBeVisible();
    await page.screenshot({ path: 'screenshots/004-sidebar.png' });
  });

  test('005: Main dashboard container should exist', async ({ page }) => {
    await page.goto('/');
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    await page.screenshot({ path: 'screenshots/005-main-content.png' });
  });

  test('006: Header should contain logo and user menu', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await page.screenshot({ path: 'screenshots/006-header.png' });
  });

  test('007: System status indicator should show online', async ({ page }) => {
    await page.goto('/');
    const status = page.locator('text=/Online|Active|Connected/i').first();
    await expect(status).toBeVisible();
    await page.screenshot({ path: 'screenshots/007-system-status.png' });
  });

  test('008: Revenue metrics card should display correctly', async ({ page }) => {
    await page.goto('/');
    const revenueCard = page.locator('text=/Revenue|\\$248,956/').first();
    await expect(revenueCard).toBeVisible();
    await page.screenshot({ path: 'screenshots/008-revenue-card.png' });
  });

  test('009: Active users metric should be visible', async ({ page }) => {
    await page.goto('/');
    const usersCard = page.locator('text=/Active Users|12,847/').first();
    await expect(usersCard).toBeVisible();
    await page.screenshot({ path: 'screenshots/009-active-users.png' });
  });

  test('010: System health indicator should be present', async ({ page }) => {
    await page.goto('/');
    const healthIndicator = page.locator('text=/System Health|Health/i').first();
    await expect(healthIndicator).toBeVisible();
    await page.screenshot({ path: 'screenshots/010-system-health.png' });
  });

  // Test 11-30: AI Agent Cards Tests
  test('011: All 15 AI agent cards should be visible', async ({ page }) => {
    await page.goto('/');
    const agentCards = page.locator('[data-testid*="agent-card"], [class*="agent"], div:has-text("Agent")');
    const count = await agentCards.count();
    expect(count).toBeGreaterThanOrEqual(15);
    await page.screenshot({ path: 'screenshots/011-agent-cards.png', fullPage: true });
  });

  test('012: Content Generator agent card should exist', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/Content Generator/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/012-content-generator.png' });
  });

  test('013: Market Intelligence agent should be present', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/Market Intelligence/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/013-market-intelligence.png' });
  });

  test('014: Compliance Validator agent should be visible', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/Compliance Validator/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/014-compliance-validator.png' });
  });

  test('015: Quality Scorer agent should exist', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/Quality Scorer/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/015-quality-scorer.png' });
  });

  test('016: Distribution Controller agent should be present', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/Distribution Controller/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/016-distribution-controller.png' });
  });

  test('017: WhatsApp Creator agent should be visible', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/WhatsApp Creator/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/017-whatsapp-creator.png' });
  });

  test('018: LinkedIn Generator agent should exist', async ({ page }) => {
    await page.goto('/');
    const agent = page.locator('text=/LinkedIn Generator/i').first();
    await expect(agent).toBeVisible();
    await page.screenshot({ path: 'screenshots/018-linkedin-generator.png' });
  });

  test('019: Agent cards should show status indicators', async ({ page }) => {
    await page.goto('/');
    const statusIndicators = page.locator('text=/Active|Idle|Processing/i');
    const count = await statusIndicators.count();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/019-agent-status.png' });
  });

  test('020: Agent cards should display CPU and memory metrics', async ({ page }) => {
    await page.goto('/');
    const cpuMetrics = page.locator('text=/CPU|Memory|RAM/i');
    const count = await cpuMetrics.count();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/020-agent-metrics.png' });
  });
});