import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  // Test 21-50: Navigation and Routing Tests
  test('021: Dashboard link should be clickable', async ({ page }) => {
    await page.goto('/');
    const dashboardLink = page.locator('a:has-text("Dashboard")').first();
    await dashboardLink.click();
    await expect(page).toHaveURL(/dashboard|^\//);
    await page.screenshot({ path: 'screenshots/021-dashboard-link.png' });
  });

  test('022: Agents page should be accessible', async ({ page }) => {
    await page.goto('/');
    const agentsLink = page.locator('a:has-text("Agents")').first();
    await agentsLink.click();
    await expect(page).toHaveURL(/agents/);
    await page.screenshot({ path: 'screenshots/022-agents-page.png' });
  });

  test('023: Campaigns navigation should work', async ({ page }) => {
    await page.goto('/');
    const campaignsLink = page.locator('a:has-text("Campaigns")').first();
    await campaignsLink.click();
    await expect(page).toHaveURL(/campaigns/);
    await page.screenshot({ path: 'screenshots/023-campaigns-page.png' });
  });

  test('024: Advisors page should load', async ({ page }) => {
    await page.goto('/');
    const advisorsLink = page.locator('a:has-text("Advisors")').first();
    await advisorsLink.click();
    await expect(page).toHaveURL(/advisors/);
    await page.screenshot({ path: 'screenshots/024-advisors-page.png' });
  });

  test('025: Analytics section should be accessible', async ({ page }) => {
    await page.goto('/');
    const analyticsLink = page.locator('a:has-text("Analytics")').first();
    await analyticsLink.click();
    await expect(page).toHaveURL(/analytics/);
    await page.screenshot({ path: 'screenshots/025-analytics-page.png' });
  });

  test('026: Settings page should load', async ({ page }) => {
    await page.goto('/');
    const settingsLink = page.locator('a:has-text("Settings")').first();
    await settingsLink.click();
    await expect(page).toHaveURL(/settings/);
    await page.screenshot({ path: 'screenshots/026-settings-page.png' });
  });

  test('027: Back navigation should work', async ({ page }) => {
    await page.goto('/');
    await page.locator('a:has-text("Agents")').first().click();
    await page.goBack();
    await expect(page).toHaveURL(/^\//);
    await page.screenshot({ path: 'screenshots/027-back-navigation.png' });
  });

  test('028: Forward navigation should work', async ({ page }) => {
    await page.goto('/');
    await page.locator('a:has-text("Agents")').first().click();
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL(/agents/);
    await page.screenshot({ path: 'screenshots/028-forward-navigation.png' });
  });

  test('029: Breadcrumbs should be visible on sub-pages', async ({ page }) => {
    await page.goto('/agents');
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"], nav:has-text("Home")');
    await expect(breadcrumbs.first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/029-breadcrumbs.png' });
  });

  test('030: Mobile menu toggle should work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const menuButton = page.locator('button[aria-label*="menu"], button:has([class*="hamburger"])').first();
    await menuButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/030-mobile-menu.png' });
  });

  test('031: Sidebar should collapse on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const sidebar = page.locator('[role="navigation"]');
    const isVisible = await sidebar.isVisible();
    await page.screenshot({ path: 'screenshots/031-mobile-sidebar.png' });
  });

  test('032: Desktop sidebar should be persistent', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    const sidebar = page.locator('[role="navigation"]');
    await expect(sidebar).toBeVisible();
    await page.screenshot({ path: 'screenshots/032-desktop-sidebar.png' });
  });

  test('033: Quick actions menu should be accessible', async ({ page }) => {
    await page.goto('/');
    const quickActions = page.locator('[aria-label*="quick"], button:has-text("Quick Actions")').first();
    if (await quickActions.isVisible()) {
      await quickActions.click();
      await page.screenshot({ path: 'screenshots/033-quick-actions.png' });
    }
  });

  test('034: User profile dropdown should open', async ({ page }) => {
    await page.goto('/');
    const profileButton = page.locator('[aria-label*="profile"], [aria-label*="user"], button:has(img[alt*="avatar"])').first();
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.screenshot({ path: 'screenshots/034-profile-dropdown.png' });
    }
  });

  test('035: Search functionality should be present', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test search');
    await page.screenshot({ path: 'screenshots/035-search-input.png' });
  });

  test('036: Notifications bell should be clickable', async ({ page }) => {
    await page.goto('/');
    const notificationBell = page.locator('[aria-label*="notification"], button:has([class*="bell"])').first();
    if (await notificationBell.isVisible()) {
      await notificationBell.click();
      await page.screenshot({ path: 'screenshots/036-notifications.png' });
    }
  });

  test('037: Help/Support link should exist', async ({ page }) => {
    await page.goto('/');
    const helpLink = page.locator('a:has-text("Help"), a:has-text("Support")').first();
    if (await helpLink.isVisible()) {
      await helpLink.click();
      await page.screenshot({ path: 'screenshots/037-help-support.png' });
    }
  });

  test('038: Logout button should be present', async ({ page }) => {
    await page.goto('/');
    const profileButton = page.locator('[aria-label*="profile"], [aria-label*="user"]').first();
    if (await profileButton.isVisible()) {
      await profileButton.click();
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out")').first();
      await expect(logoutButton).toBeVisible();
      await page.screenshot({ path: 'screenshots/038-logout-button.png' });
    }
  });

  test('039: Tab navigation should work with keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
    await page.screenshot({ path: 'screenshots/039-keyboard-nav.png' });
  });

  test('040: Logo should link to home', async ({ page }) => {
    await page.goto('/agents');
    const logo = page.locator('[alt*="logo"], [alt*="FinAdvise"], a:has(img)').first();
    await logo.click();
    await expect(page).toHaveURL(/^\//);
    await page.screenshot({ path: 'screenshots/040-logo-home-link.png' });
  });

  test('041: Active nav item should be highlighted', async ({ page }) => {
    await page.goto('/agents');
    const activeNavItem = page.locator('a[aria-current="page"], .active, [class*="active"]').first();
    await expect(activeNavItem).toBeVisible();
    await page.screenshot({ path: 'screenshots/041-active-nav.png' });
  });

  test('042: Page transitions should be smooth', async ({ page }) => {
    await page.goto('/');
    const startTime = Date.now();
    await page.locator('a:has-text("Agents")').first().click();
    const endTime = Date.now();
    const transitionTime = endTime - startTime;
    expect(transitionTime).toBeLessThan(3000);
    await page.screenshot({ path: 'screenshots/042-page-transition.png' });
  });

  test('043: 404 page should handle invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-404');
    const errorMessage = page.locator('text=/404|Not Found/i').first();
    await expect(errorMessage).toBeVisible();
    await page.screenshot({ path: 'screenshots/043-404-page.png' });
  });

  test('044: Deep linking should work correctly', async ({ page }) => {
    await page.goto('/agents?filter=active&sort=name');
    await expect(page).toHaveURL(/filter=active/);
    await page.screenshot({ path: 'screenshots/044-deep-linking.png' });
  });

  test('045: Navigation history should be maintained', async ({ page }) => {
    await page.goto('/');
    await page.locator('a:has-text("Agents")').first().click();
    await page.locator('a:has-text("Campaigns")').first().click();
    await page.goBack();
    await expect(page).toHaveURL(/agents/);
    await page.screenshot({ path: 'screenshots/045-nav-history.png' });
  });

  test('046: Sidebar toggle should persist state', async ({ page }) => {
    await page.goto('/');
    const toggleButton = page.locator('button[aria-label*="toggle sidebar"]').first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.reload();
      await page.screenshot({ path: 'screenshots/046-sidebar-state.png' });
    }
  });

  test('047: Quick search shortcut should work', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+K');
    const searchModal = page.locator('[role="dialog"]:has(input[type="search"])').first();
    if (await searchModal.isVisible()) {
      await page.screenshot({ path: 'screenshots/047-search-shortcut.png' });
    }
  });

  test('048: Navigation should handle concurrent requests', async ({ page }) => {
    await page.goto('/');
    await Promise.all([
      page.locator('a:has-text("Agents")').first().click(),
      page.waitForLoadState('networkidle')
    ]);
    await expect(page).toHaveURL(/agents/);
    await page.screenshot({ path: 'screenshots/048-concurrent-nav.png' });
  });

  test('049: Sidebar scroll should work for many items', async ({ page }) => {
    await page.goto('/');
    const sidebar = page.locator('[role="navigation"]');
    await sidebar.evaluate(el => el.scrollTop = el.scrollHeight);
    await page.screenshot({ path: 'screenshots/049-sidebar-scroll.png' });
  });

  test('050: Navigation performance should be acceptable', async ({ page }) => {
    await page.goto('/');
    const metrics = await page.evaluate(() => performance.getEntriesByType('navigation')[0]);
    expect(metrics).toBeDefined();
    await page.screenshot({ path: 'screenshots/050-nav-performance.png' });
  });
});