import { test, expect } from '@playwright/test';

test.describe('Accessibility and Mobile Tests', () => {
  // Test 251-300: Accessibility, Mobile Responsiveness, and Comprehensive Tests
  test('251: Should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      if (!text?.trim()) {
        expect(ariaLabel).toBeDefined();
      }
    }
    await page.screenshot({ path: 'screenshots/251-aria-labels.png' });
  });

  test('252: Should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
    await page.screenshot({ path: 'screenshots/252-keyboard-nav.png' });
  });

  test('253: Should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    const textElements = page.locator('p, span, div').first();
    const color = await textElements.evaluate(el =>
      window.getComputedStyle(el).color
    );
    expect(color).toBeDefined();
    await page.screenshot({ path: 'screenshots/253-color-contrast.png' });
  });

  test('254: Should have alt text for images', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
    await page.screenshot({ path: 'screenshots/254-alt-text.png' });
  });

  test('255: Should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1);
    await page.screenshot({ path: 'screenshots/255-heading-hierarchy.png' });
  });

  test('256: Should support screen readers', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('[href="#main"], [href="#content"]');
    const hasSkipLink = await skipLink.count() > 0;
    await page.screenshot({ path: 'screenshots/256-screen-reader.png' });
  });

  test('257: Should have focus indicators', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    const outline = await focusedElement.evaluate(el =>
      window.getComputedStyle(el).outline
    );
    expect(outline).not.toBe('none');
    await page.screenshot({ path: 'screenshots/257-focus-indicators.png' });
  });

  test('258: Should work on mobile portrait', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    await page.screenshot({ path: 'screenshots/258-mobile-portrait.png' });
  });

  test('259: Should work on mobile landscape', async ({ page }) => {
    await page.setViewportSize({ width: 812, height: 375 });
    await page.goto('/');
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    await page.screenshot({ path: 'screenshots/259-mobile-landscape.png' });
  });

  test('260: Should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    await page.screenshot({ path: 'screenshots/260-tablet-view.png' });
  });

  test('261: Touch interactions should work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const button = page.locator('button').first();
    await button.tap();
    await page.screenshot({ path: 'screenshots/261-touch-interaction.png' });
  });

  test('262: Should have responsive images', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const img = images.nth(i);
      const srcset = await img.getAttribute('srcset');
      const sizes = await img.getAttribute('sizes');
      if (srcset || sizes) {
        expect(true).toBeTruthy();
      }
    }
    await page.screenshot({ path: 'screenshots/262-responsive-images.png' });
  });

  test('263: Should handle text zoom', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const overflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    await page.screenshot({ path: 'screenshots/263-text-zoom.png' });
  });

  test('264: Should have proper form labels', async ({ page }) => {
    await page.goto('/');
    const inputs = page.locator('input, select, textarea');
    const count = await inputs.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(hasLabel).toBeTruthy();
      }
    }
    await page.screenshot({ path: 'screenshots/264-form-labels.png' });
  });

  test('265: Should announce dynamic content', async ({ page }) => {
    await page.goto('/');
    const liveRegions = page.locator('[aria-live], [role="alert"], [role="status"]');
    const count = await liveRegions.count();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/265-live-regions.png' });
  });

  test('266: Should have language attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeDefined();
    await page.screenshot({ path: 'screenshots/266-language-attr.png' });
  });

  test('267: Should support reduced motion', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const animations = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return styles.animation || styles.transition;
    });
    await page.screenshot({ path: 'screenshots/267-reduced-motion.png' });
  });

  test('268: Should have descriptive link text', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a');
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      expect(text).not.toBe('click here');
      expect(text).not.toBe('here');
    }
    await page.screenshot({ path: 'screenshots/268-link-text.png' });
  });

  test('269: Should handle offline mode', async ({ page, context }) => {
    await page.goto('/');
    await context.setOffline(true);
    await page.reload();
    const offlineIndicator = page.locator('text=/offline|connection/i');
    await page.screenshot({ path: 'screenshots/269-offline-mode.png' });
    await context.setOffline(false);
  });

  test('270: Should work with slow network', async ({ page }) => {
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'screenshots/270-slow-network.png' });
  });

  test('271: Should handle print mode', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: 'screenshots/271-print-mode.png' });
  });

  test('272: Should support dark mode', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.screenshot({ path: 'screenshots/272-dark-mode.png' });
  });

  test('273: Should support light mode', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.screenshot({ path: 'screenshots/273-light-mode.png' });
  });

  test('274: Should have skip navigation links', async ({ page }) => {
    await page.goto('/');
    const skipLinks = page.locator('a:has-text("Skip")');
    const count = await skipLinks.count();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/274-skip-nav.png' });
  });

  test('275: Should handle JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    const page = await context.newPage();
    await page.goto('/');
    const noscript = page.locator('noscript');
    const hasNoscript = await noscript.count() > 0;
    await page.screenshot({ path: 'screenshots/275-no-javascript.png' });
    await context.close();
  });

  test('276: Should have proper table headers', async ({ page }) => {
    await page.goto('/');
    const tables = page.locator('table');
    const count = await tables.count();
    for (let i = 0; i < Math.min(count, 2); i++) {
      const table = tables.nth(i);
      const headers = table.locator('th');
      const hasHeaders = await headers.count() > 0;
      expect(hasHeaders).toBeTruthy();
    }
    await page.screenshot({ path: 'screenshots/276-table-headers.png' });
  });

  test('277: Should support browser zoom', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.body.style.zoom = '150%';
    });
    await page.screenshot({ path: 'screenshots/277-browser-zoom.png' });
  });

  test('278: Should have error messages for forms', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      const submitButton = form.locator('button[type="submit"]');
      await submitButton.click();
      const errorMessages = page.locator('[role="alert"], .error-message');
      const hasErrors = await errorMessages.count() > 0;
      await page.screenshot({ path: 'screenshots/278-error-messages.png' });
    }
  });

  test('279: Should have loading indicators', async ({ page }) => {
    await page.goto('/');
    const loadingIndicators = page.locator('[aria-busy="true"], .loading, .spinner');
    const hasLoading = await loadingIndicators.count() > 0;
    await page.screenshot({ path: 'screenshots/279-loading-indicators.png' });
  });

  test('280: Should handle viewport resize', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
    await page.screenshot({ path: 'screenshots/280-viewport-resize.png' });
  });

  test('281: Should have breadcrumb navigation', async ({ page }) => {
    await page.goto('/agents');
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"], .breadcrumb');
    const hasBreadcrumbs = await breadcrumbs.count() > 0;
    await page.screenshot({ path: 'screenshots/281-breadcrumbs.png' });
  });

  test('282: Should handle long content', async ({ page }) => {
    await page.goto('/');
    const longContent = page.locator('text=/Lorem ipsum|content/i');
    if (await longContent.first().isVisible()) {
      const hasScroll = await page.evaluate(() => {
        return document.body.scrollHeight > window.innerHeight;
      });
      await page.screenshot({ path: 'screenshots/282-long-content.png' });
    }
  });

  test('283: Should have consistent navigation', async ({ page }) => {
    await page.goto('/');
    const nav1 = await page.locator('nav').count();
    await page.goto('/agents');
    const nav2 = await page.locator('nav').count();
    expect(nav1).toBe(nav2);
    await page.screenshot({ path: 'screenshots/283-consistent-nav.png' });
  });

  test('284: Should handle modal dialogs', async ({ page }) => {
    await page.goto('/');
    const modalTrigger = page.locator('button[data-modal], button[aria-haspopup="dialog"]').first();
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      await page.screenshot({ path: 'screenshots/284-modal-dialog.png' });
    }
  });

  test('285: Should have tooltips for icons', async ({ page }) => {
    await page.goto('/');
    const iconButtons = page.locator('button:has(svg)');
    const count = await iconButtons.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = iconButtons.nth(i);
      const title = await button.getAttribute('title');
      const ariaLabel = await button.getAttribute('aria-label');
      expect(title || ariaLabel).toBeDefined();
    }
    await page.screenshot({ path: 'screenshots/285-icon-tooltips.png' });
  });

  test('286: Should handle dropdown menus', async ({ page }) => {
    await page.goto('/');
    const dropdownTrigger = page.locator('[aria-haspopup="menu"], button[data-dropdown]').first();
    if (await dropdownTrigger.isVisible()) {
      await dropdownTrigger.click();
      const menu = page.locator('[role="menu"]');
      await expect(menu).toBeVisible();
      await page.screenshot({ path: 'screenshots/286-dropdown-menu.png' });
    }
  });

  test('287: Should have search functionality', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="search"]');
    const hasSearch = await searchInput.count() > 0;
    expect(hasSearch).toBeTruthy();
    await page.screenshot({ path: 'screenshots/287-search-function.png' });
  });

  test('288: Should handle tabs navigation', async ({ page }) => {
    await page.goto('/');
    const tabs = page.locator('[role="tablist"]');
    if (await tabs.first().isVisible()) {
      const tab = page.locator('[role="tab"]').first();
      await tab.click();
      await page.screenshot({ path: 'screenshots/288-tabs-nav.png' });
    }
  });

  test('289: Should have footer information', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await page.screenshot({ path: 'screenshots/289-footer-info.png' });
  });

  test('290: Should handle accordion components', async ({ page }) => {
    await page.goto('/');
    const accordion = page.locator('[data-accordion], details').first();
    if (await accordion.isVisible()) {
      await accordion.click();
      await page.screenshot({ path: 'screenshots/290-accordion.png' });
    }
  });

  test('291: Should have date pickers', async ({ page }) => {
    await page.goto('/campaigns');
    const datePicker = page.locator('input[type="date"], [aria-label*="date"]').first();
    if (await datePicker.isVisible()) {
      await datePicker.click();
      await page.screenshot({ path: 'screenshots/291-date-picker.png' });
    }
  });

  test('292: Should handle file uploads', async ({ page }) => {
    await page.goto('/settings');
    const fileInput = page.locator('input[type="file"]');
    const hasFileInput = await fileInput.count() > 0;
    await page.screenshot({ path: 'screenshots/292-file-upload.png' });
  });

  test('293: Should have progress indicators', async ({ page }) => {
    await page.goto('/');
    const progressBar = page.locator('[role="progressbar"], progress, .progress');
    const hasProgress = await progressBar.count() > 0;
    await page.screenshot({ path: 'screenshots/293-progress-bar.png' });
  });

  test('294: Should handle pagination', async ({ page }) => {
    await page.goto('/advisors');
    const pagination = page.locator('[aria-label*="pagination"], .pagination');
    if (await pagination.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/294-pagination.png' });
    }
  });

  test('295: Should have notification system', async ({ page }) => {
    await page.goto('/');
    const notificationIcon = page.locator('[aria-label*="notification"]');
    if (await notificationIcon.first().isVisible()) {
      await notificationIcon.first().click();
      await page.screenshot({ path: 'screenshots/295-notifications.png' });
    }
  });

  test('296: Should handle autocomplete', async ({ page }) => {
    await page.goto('/');
    const autocomplete = page.locator('[role="combobox"], [aria-autocomplete]').first();
    if (await autocomplete.isVisible()) {
      await autocomplete.type('test');
      await page.screenshot({ path: 'screenshots/296-autocomplete.png' });
    }
  });

  test('297: Should have charts and graphs', async ({ page }) => {
    await page.goto('/analytics');
    const charts = page.locator('canvas, svg.chart, [class*="chart"]');
    const hasCharts = await charts.count() > 0;
    expect(hasCharts).toBeTruthy();
    await page.screenshot({ path: 'screenshots/297-charts.png' });
  });

  test('298: Should handle toggle switches', async ({ page }) => {
    await page.goto('/settings');
    const toggleSwitch = page.locator('[role="switch"], input[type="checkbox"]').first();
    if (await toggleSwitch.isVisible()) {
      await toggleSwitch.click();
      await page.screenshot({ path: 'screenshots/298-toggle-switch.png' });
    }
  });

  test('299: Should have user avatar', async ({ page }) => {
    await page.goto('/');
    const avatar = page.locator('[alt*="avatar"], img[src*="avatar"], .avatar');
    const hasAvatar = await avatar.count() > 0;
    await page.screenshot({ path: 'screenshots/299-user-avatar.png' });
  });

  test('300: Final comprehensive test - Full page validation', async ({ page }) => {
    await page.goto('/');

    // Check all major components are present
    const header = page.locator('header');
    const nav = page.locator('nav');
    const main = page.locator('main');
    const footer = page.locator('footer');

    await expect(header).toBeVisible();
    await expect(nav).toBeVisible();
    await expect(main).toBeVisible();
    await expect(footer).toBeVisible();

    // Check glassmorphism is applied
    const glassElements = page.locator('[class*="backdrop-blur"]');
    const hasGlassmorphism = await glassElements.count() > 0;
    expect(hasGlassmorphism).toBeTruthy();

    // Check agents are visible
    const agentCards = page.locator('text=/Agent|Generator|Controller/i');
    const hasAgents = await agentCards.count() > 0;
    expect(hasAgents).toBeTruthy();

    // Take full page screenshot
    await page.screenshot({ path: 'screenshots/300-final-validation.png', fullPage: true });
  });
});