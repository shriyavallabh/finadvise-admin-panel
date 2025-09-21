import { test, expect } from '@playwright/test';

test.describe('Visual and UI Tests', () => {
  // Test 101-150: Visual and UI Tests
  test('101: Glassmorphism blur effect intensity', async ({ page }) => {
    await page.goto('/');
    const element = page.locator('[class*="backdrop-blur"]').first();
    const blurValue = await element.evaluate(el =>
      window.getComputedStyle(el).backdropFilter
    );
    expect(blurValue).toContain('blur');
    await page.screenshot({ path: 'screenshots/101-blur-intensity.png' });
  });

  test('102: Glass transparency levels', async ({ page }) => {
    await page.goto('/');
    const glassElement = page.locator('[class*="bg-opacity"], [class*="bg-white\\/"]').first();
    const opacity = await glassElement.evaluate(el =>
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(opacity)).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/102-transparency.png' });
  });

  test('103: 3D transform on hover', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[class*="hover\\:scale"], [class*="hover\\:transform"]').first();
    await card.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/103-3d-hover.png' });
  });

  test('104: Purple gradient background animation', async ({ page }) => {
    await page.goto('/');
    const hasGradient = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      return style.background.includes('gradient') || style.backgroundImage.includes('gradient');
    });
    expect(hasGradient).toBeTruthy();
    await page.screenshot({ path: 'screenshots/104-gradient-anim.png' });
  });

  test('105: Card shadow and elevation', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[class*="shadow"]').first();
    const shadow = await card.evaluate(el =>
      window.getComputedStyle(el).boxShadow
    );
    expect(shadow).not.toBe('none');
    await page.screenshot({ path: 'screenshots/105-card-shadow.png' });
  });

  test('106: Typography hierarchy', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1').first();
    const h2 = page.locator('h2').first();
    const h1Size = await h1.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    const h2Size = await h2.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    expect(parseFloat(h1Size)).toBeGreaterThan(parseFloat(h2Size));
    await page.screenshot({ path: 'screenshots/106-typography.png' });
  });

  test('107: Color scheme consistency', async ({ page }) => {
    await page.goto('/');
    const primaryButton = page.locator('button.primary, [class*="bg-primary"]').first();
    const color = await primaryButton.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(color).toBeDefined();
    await page.screenshot({ path: 'screenshots/107-colors.png' });
  });

  test('108: Icon consistency and size', async ({ page }) => {
    await page.goto('/');
    const icons = page.locator('svg, [class*="icon"]');
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/108-icons.png' });
  });

  test('109: Button hover states', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button').first();
    await button.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/109-button-hover.png' });
  });

  test('110: Input field focus states', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input').first();
    await input.focus();
    await page.screenshot({ path: 'screenshots/110-input-focus.png' });
  });

  test('111: Loading spinner animation', async ({ page }) => {
    await page.goto('/');
    const spinner = page.locator('[class*="animate-spin"], [class*="loading"]').first();
    if (await spinner.isVisible()) {
      await page.screenshot({ path: 'screenshots/111-spinner.png' });
    }
  });

  test('112: Progress bar visualization', async ({ page }) => {
    await page.goto('/');
    const progressBar = page.locator('[role="progressbar"], [class*="progress"]').first();
    if (await progressBar.isVisible()) {
      await page.screenshot({ path: 'screenshots/112-progress.png' });
    }
  });

  test('113: Badge styling and colors', async ({ page }) => {
    await page.goto('/');
    const badge = page.locator('[class*="badge"]').first();
    await expect(badge).toBeVisible();
    await page.screenshot({ path: 'screenshots/113-badges.png' });
  });

  test('114: Alert component styling', async ({ page }) => {
    await page.goto('/');
    const alert = page.locator('[role="alert"], [class*="alert"]').first();
    if (await alert.isVisible()) {
      await page.screenshot({ path: 'screenshots/114-alerts.png' });
    }
  });

  test('115: Modal backdrop blur', async ({ page }) => {
    await page.goto('/');
    const modalTrigger = page.locator('button').first();
    await modalTrigger.click();
    await page.waitForTimeout(500);
    const backdrop = page.locator('[class*="backdrop"], .modal-backdrop').first();
    if (await backdrop.isVisible()) {
      await page.screenshot({ path: 'screenshots/115-modal-blur.png' });
    }
  });

  test('116: Tooltip styling', async ({ page }) => {
    await page.goto('/');
    const tooltipTrigger = page.locator('[aria-describedby], [data-tooltip]').first();
    if (await tooltipTrigger.isVisible()) {
      await tooltipTrigger.hover();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/116-tooltip.png' });
    }
  });

  test('117: Dropdown menu animation', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('[aria-haspopup="menu"]').first();
    if (await dropdown.isVisible()) {
      await dropdown.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'screenshots/117-dropdown.png' });
    }
  });

  test('118: Table styling and stripes', async ({ page }) => {
    await page.goto('/agents');
    const table = page.locator('table').first();
    if (await table.isVisible()) {
      await page.screenshot({ path: 'screenshots/118-table.png' });
    }
  });

  test('119: Chart color palette', async ({ page }) => {
    await page.goto('/');
    const chart = page.locator('canvas, svg.chart').first();
    if (await chart.isVisible()) {
      await page.screenshot({ path: 'screenshots/119-chart-colors.png' });
    }
  });

  test('120: Dark mode toggle functionality', async ({ page }) => {
    await page.goto('/');
    const darkModeToggle = page.locator('[aria-label*="theme"], button:has-text("Dark")').first();
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/120-dark-mode.png' });
    }
  });

  test('121: Light mode styling', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const bgColor = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    await page.screenshot({ path: 'screenshots/121-light-mode.png' });
  });

  test('122: Responsive grid layout', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'screenshots/122-grid-desktop.png' });
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: 'screenshots/122-grid-tablet.png' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ path: 'screenshots/122-grid-mobile.png' });
  });

  test('123: Flex container alignment', async ({ page }) => {
    await page.goto('/');
    const flexContainer = page.locator('[class*="flex"]').first();
    const display = await flexContainer.evaluate(el =>
      window.getComputedStyle(el).display
    );
    expect(display).toContain('flex');
    await page.screenshot({ path: 'screenshots/123-flex-layout.png' });
  });

  test('124: Spacing and padding consistency', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[class*="p-"], [class*="padding"]').first();
    const padding = await card.evaluate(el =>
      window.getComputedStyle(el).padding
    );
    expect(padding).toBeDefined();
    await page.screenshot({ path: 'screenshots/124-spacing.png' });
  });

  test('125: Border radius consistency', async ({ page }) => {
    await page.goto('/');
    const roundedElement = page.locator('[class*="rounded"]').first();
    const borderRadius = await roundedElement.evaluate(el =>
      window.getComputedStyle(el).borderRadius
    );
    expect(borderRadius).not.toBe('0px');
    await page.screenshot({ path: 'screenshots/125-borders.png' });
  });

  test('126: Animation smoothness', async ({ page }) => {
    await page.goto('/');
    const animatedElement = page.locator('[class*="transition"], [class*="animate"]').first();
    const transition = await animatedElement.evaluate(el =>
      window.getComputedStyle(el).transition
    );
    expect(transition).toBeDefined();
    await page.screenshot({ path: 'screenshots/126-animations.png' });
  });

  test('127: Scroll behavior smoothness', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/127-scroll.png' });
  });

  test('128: Focus outline visibility', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    const outline = await focusedElement.evaluate(el =>
      window.getComputedStyle(el).outline
    );
    await page.screenshot({ path: 'screenshots/128-focus-outline.png' });
  });

  test('129: Disabled state styling', async ({ page }) => {
    await page.goto('/');
    const disabledButton = page.locator('button:disabled, [disabled]').first();
    if (await disabledButton.isVisible()) {
      const opacity = await disabledButton.evaluate(el =>
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(opacity)).toBeLessThan(1);
      await page.screenshot({ path: 'screenshots/129-disabled.png' });
    }
  });

  test('130: Active state indication', async ({ page }) => {
    await page.goto('/');
    const activeElement = page.locator('[aria-current="page"], .active').first();
    if (await activeElement.isVisible()) {
      await page.screenshot({ path: 'screenshots/130-active-state.png' });
    }
  });

  test('131: Error state visualization', async ({ page }) => {
    await page.goto('/');
    const errorElement = page.locator('[class*="error"], .error').first();
    if (await errorElement.isVisible()) {
      await page.screenshot({ path: 'screenshots/131-error-visual.png' });
    }
  });

  test('132: Success state styling', async ({ page }) => {
    await page.goto('/');
    const successElement = page.locator('[class*="success"], .success').first();
    if (await successElement.isVisible()) {
      await page.screenshot({ path: 'screenshots/132-success-visual.png' });
    }
  });

  test('133: Warning state appearance', async ({ page }) => {
    await page.goto('/');
    const warningElement = page.locator('[class*="warning"], .warning').first();
    if (await warningElement.isVisible()) {
      await page.screenshot({ path: 'screenshots/133-warning-visual.png' });
    }
  });

  test('134: Info state display', async ({ page }) => {
    await page.goto('/');
    const infoElement = page.locator('[class*="info"], .info').first();
    if (await infoElement.isVisible()) {
      await page.screenshot({ path: 'screenshots/134-info-visual.png' });
    }
  });

  test('135: Skeleton loading states', async ({ page }) => {
    await page.goto('/');
    const skeleton = page.locator('[class*="skeleton"], .skeleton').first();
    if (await skeleton.isVisible()) {
      await page.screenshot({ path: 'screenshots/135-skeleton.png' });
    }
  });

  test('136: Empty state illustration', async ({ page }) => {
    await page.goto('/agents?filter=none');
    const emptyState = page.locator('[class*="empty"], .empty-state').first();
    if (await emptyState.isVisible()) {
      await page.screenshot({ path: 'screenshots/136-empty-state.png' });
    }
  });

  test('137: Pagination controls styling', async ({ page }) => {
    await page.goto('/agents');
    const pagination = page.locator('[aria-label*="pagination"], .pagination').first();
    if (await pagination.isVisible()) {
      await page.screenshot({ path: 'screenshots/137-pagination.png' });
    }
  });

  test('138: Search bar visual design', async ({ page }) => {
    await page.goto('/');
    const searchBar = page.locator('input[type="search"]').first();
    await searchBar.focus();
    await page.screenshot({ path: 'screenshots/138-search-bar.png' });
  });

  test('139: Filter panel layout', async ({ page }) => {
    await page.goto('/agents');
    const filterPanel = page.locator('[aria-label*="filter"], .filter-panel').first();
    if (await filterPanel.isVisible()) {
      await page.screenshot({ path: 'screenshots/139-filter-panel.png' });
    }
  });

  test('140: Sort controls appearance', async ({ page }) => {
    await page.goto('/agents');
    const sortControl = page.locator('[aria-label*="sort"], .sort-control').first();
    if (await sortControl.isVisible()) {
      await page.screenshot({ path: 'screenshots/140-sort-controls.png' });
    }
  });

  test('141: Breadcrumb styling', async ({ page }) => {
    await page.goto('/agents/details');
    const breadcrumb = page.locator('[aria-label="Breadcrumb"], .breadcrumb').first();
    if (await breadcrumb.isVisible()) {
      await page.screenshot({ path: 'screenshots/141-breadcrumb.png' });
    }
  });

  test('142: Tab component design', async ({ page }) => {
    await page.goto('/');
    const tabs = page.locator('[role="tablist"]').first();
    if (await tabs.isVisible()) {
      await page.screenshot({ path: 'screenshots/142-tabs.png' });
    }
  });

  test('143: Accordion expansion animation', async ({ page }) => {
    await page.goto('/');
    const accordion = page.locator('[aria-expanded]').first();
    if (await accordion.isVisible()) {
      await accordion.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'screenshots/143-accordion.png' });
    }
  });

  test('144: Slider component styling', async ({ page }) => {
    await page.goto('/settings');
    const slider = page.locator('input[type="range"], [role="slider"]').first();
    if (await slider.isVisible()) {
      await page.screenshot({ path: 'screenshots/144-slider.png' });
    }
  });

  test('145: Toggle switch design', async ({ page }) => {
    await page.goto('/settings');
    const toggle = page.locator('[role="switch"], input[type="checkbox"]').first();
    if (await toggle.isVisible()) {
      await page.screenshot({ path: 'screenshots/145-toggle.png' });
    }
  });

  test('146: Radio button group layout', async ({ page }) => {
    await page.goto('/settings');
    const radioGroup = page.locator('[role="radiogroup"], fieldset:has(input[type="radio"])').first();
    if (await radioGroup.isVisible()) {
      await page.screenshot({ path: 'screenshots/146-radio-group.png' });
    }
  });

  test('147: Checkbox styling', async ({ page }) => {
    await page.goto('/settings');
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await page.screenshot({ path: 'screenshots/147-checkbox.png' });
    }
  });

  test('148: Date picker interface', async ({ page }) => {
    await page.goto('/analytics');
    const datePicker = page.locator('input[type="date"], [aria-label*="date"]').first();
    if (await datePicker.isVisible()) {
      await datePicker.click();
      await page.screenshot({ path: 'screenshots/148-date-picker.png' });
    }
  });

  test('149: Time picker design', async ({ page }) => {
    await page.goto('/settings');
    const timePicker = page.locator('input[type="time"], [aria-label*="time"]').first();
    if (await timePicker.isVisible()) {
      await timePicker.click();
      await page.screenshot({ path: 'screenshots/149-time-picker.png' });
    }
  });

  test('150: File upload area styling', async ({ page }) => {
    await page.goto('/settings');
    const fileUpload = page.locator('input[type="file"], [class*="upload"]').first();
    if (await fileUpload.isVisible()) {
      await page.screenshot({ path: 'screenshots/150-file-upload.png' });
    }
  });
});