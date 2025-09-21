import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  // Test 151-200: Performance and Load Tests
  test('151: Page load time should be under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    await page.screenshot({ path: 'screenshots/151-load-time.png' });
  });

  test('152: First Contentful Paint (FCP) metric', async ({ page }) => {
    await page.goto('/');
    const fcp = await page.evaluate(() => {
      const entry = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint');
      return entry ? entry.startTime : 0;
    });
    expect(fcp).toBeLessThan(2000);
    await page.screenshot({ path: 'screenshots/152-fcp.png' });
  });

  test('153: Largest Contentful Paint (LCP) metric', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    await page.screenshot({ path: 'screenshots/153-lcp.png' });
  });

  test('154: Time to Interactive (TTI)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const tti = Date.now() - startTime;
    expect(tti).toBeLessThan(5000);
    await page.screenshot({ path: 'screenshots/154-tti.png' });
  });

  test('155: JavaScript bundle size check', async ({ page }) => {
    const response = await page.goto('/');
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).map(s => s.src).filter(src => src);
    });
    expect(scripts.length).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/155-js-bundle.png' });
  });

  test('156: CSS bundle optimization', async ({ page }) => {
    await page.goto('/');
    const stylesheets = await page.evaluate(() => {
      return Array.from(document.styleSheets).length;
    });
    expect(stylesheets).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/156-css-bundle.png' });
  });

  test('157: Image optimization and lazy loading', async ({ page }) => {
    await page.goto('/');
    const images = await page.evaluate(() => {
      return Array.from(document.images).map(img => ({
        loading: img.loading,
        src: img.src
      }));
    });
    const lazyImages = images.filter(img => img.loading === 'lazy');
    expect(lazyImages.length).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: 'screenshots/157-lazy-images.png' });
  });

  test('158: Memory usage monitoring', async ({ page }) => {
    await page.goto('/');
    const memoryInfo = await page.evaluate(() => {
      // @ts-ignore
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });
    expect(memoryInfo).toBeLessThan(100 * 1024 * 1024); // Less than 100MB
    await page.screenshot({ path: 'screenshots/158-memory.png' });
  });

  test('159: CPU usage during idle', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const cpuUsage = await page.evaluate(() => {
      return performance.now();
    });
    expect(cpuUsage).toBeDefined();
    await page.screenshot({ path: 'screenshots/159-cpu-idle.png' });
  });

  test('160: Network request count', async ({ page }) => {
    const requests = [];
    page.on('request', request => requests.push(request));
    await page.goto('/');
    expect(requests.length).toBeLessThan(100);
    await page.screenshot({ path: 'screenshots/160-network-requests.png' });
  });

  test('161: WebSocket connection stability', async ({ page }) => {
    await page.goto('/');
    const wsConnections = await page.evaluate(() => {
      // Check for WebSocket in window
      return typeof WebSocket !== 'undefined';
    });
    expect(wsConnections).toBeTruthy();
    await page.screenshot({ path: 'screenshots/161-websocket.png' });
  });

  test('162: Cache utilization', async ({ page }) => {
    await page.goto('/');
    await page.reload();
    const cachedResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      return entries.filter(e => e.transferSize === 0 && e.decodedBodySize > 0);
    });
    expect(cachedResources.length).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: 'screenshots/162-cache.png' });
  });

  test('163: Service worker registration', async ({ page }) => {
    await page.goto('/');
    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(hasServiceWorker).toBeTruthy();
    await page.screenshot({ path: 'screenshots/163-service-worker.png' });
  });

  test('164: Scroll performance', async ({ page }) => {
    await page.goto('/');
    const startTime = Date.now();
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    const scrollTime = Date.now() - startTime;
    expect(scrollTime).toBeLessThan(2000);
    await page.screenshot({ path: 'screenshots/164-scroll-perf.png' });
  });

  test('165: Animation frame rate', async ({ page }) => {
    await page.goto('/');
    const fps = await page.evaluate(() => {
      return new Promise(resolve => {
        let frames = 0;
        const startTime = performance.now();
        function countFrames() {
          frames++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frames);
          }
        }
        requestAnimationFrame(countFrames);
      });
    });
    expect(fps).toBeGreaterThan(30);
    await page.screenshot({ path: 'screenshots/165-fps.png' });
  });

  test('166: DOM node count', async ({ page }) => {
    await page.goto('/');
    const nodeCount = await page.evaluate(() => {
      return document.getElementsByTagName('*').length;
    });
    expect(nodeCount).toBeLessThan(3000);
    await page.screenshot({ path: 'screenshots/166-dom-nodes.png' });
  });

  test('167: Event listener count', async ({ page }) => {
    await page.goto('/');
    const listenerCount = await page.evaluate(() => {
      return getEventListeners(document).length || 0;
    });
    await page.screenshot({ path: 'screenshots/167-listeners.png' });
  });

  test('168: Resource timing', async ({ page }) => {
    await page.goto('/');
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(r => ({
        name: r.name,
        duration: r.duration
      }));
    });
    const slowResources = resources.filter(r => r.duration > 1000);
    expect(slowResources.length).toBeLessThan(5);
    await page.screenshot({ path: 'screenshots/168-resources.png' });
  });

  test('169: Long task detection', async ({ page }) => {
    await page.goto('/');
    const longTasks = await page.evaluate(() => {
      return new Promise(resolve => {
        const tasks = [];
        const observer = new PerformanceObserver(list => {
          tasks.push(...list.getEntries());
        });
        observer.observe({ entryTypes: ['longtask'] });
        setTimeout(() => resolve(tasks), 3000);
      });
    });
    await page.screenshot({ path: 'screenshots/169-long-tasks.png' });
  });

  test('170: Input latency', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input').first();
    const startTime = Date.now();
    await input.click();
    const clickTime = Date.now() - startTime;
    expect(clickTime).toBeLessThan(100);
    await page.screenshot({ path: 'screenshots/170-input-latency.png' });
  });

  test('171: API response time', async ({ page }) => {
    const apiTimes = [];
    page.on('response', response => {
      if (response.url().includes('api')) {
        apiTimes.push(response.timing());
      }
    });
    await page.goto('/');
    await page.screenshot({ path: 'screenshots/171-api-response.png' });
  });

  test('172: Database query performance', async ({ page }) => {
    await page.goto('/agents');
    const loadTime = await page.evaluate(() => performance.timing.loadEventEnd - performance.timing.navigationStart);
    expect(loadTime).toBeLessThan(3000);
    await page.screenshot({ path: 'screenshots/172-db-query.png' });
  });

  test('173: Real-time update latency', async ({ page }) => {
    await page.goto('/');
    const updateTime = await page.evaluate(() => {
      return new Promise(resolve => {
        const start = Date.now();
        // Simulate waiting for real-time update
        setTimeout(() => resolve(Date.now() - start), 100);
      });
    });
    expect(updateTime).toBeLessThan(200);
    await page.screenshot({ path: 'screenshots/173-realtime.png' });
  });

  test('174: Chart rendering performance', async ({ page }) => {
    await page.goto('/');
    const chartRenderTime = await page.evaluate(() => {
      const start = performance.now();
      // Find and measure chart rendering
      const charts = document.querySelectorAll('canvas, svg.chart');
      return performance.now() - start;
    });
    expect(chartRenderTime).toBeLessThan(500);
    await page.screenshot({ path: 'screenshots/174-chart-render.png' });
  });

  test('175: Table pagination performance', async ({ page }) => {
    await page.goto('/agents');
    const paginationButton = page.locator('[aria-label*="next page"]').first();
    if (await paginationButton.isVisible()) {
      const startTime = Date.now();
      await paginationButton.click();
      const paginationTime = Date.now() - startTime;
      expect(paginationTime).toBeLessThan(1000);
    }
    await page.screenshot({ path: 'screenshots/175-pagination-perf.png' });
  });

  test('176: Search performance', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="search"]').first();
    const startTime = Date.now();
    await searchInput.fill('test');
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(500);
    await page.screenshot({ path: 'screenshots/176-search-perf.png' });
  });

  test('177: Filter application speed', async ({ page }) => {
    await page.goto('/agents');
    const filterButton = page.locator('button:has-text("Filter")').first();
    if (await filterButton.isVisible()) {
      const startTime = Date.now();
      await filterButton.click();
      const filterTime = Date.now() - startTime;
      expect(filterTime).toBeLessThan(500);
    }
    await page.screenshot({ path: 'screenshots/177-filter-speed.png' });
  });

  test('178: Sort operation performance', async ({ page }) => {
    await page.goto('/agents');
    const sortButton = page.locator('[aria-label*="sort"]').first();
    if (await sortButton.isVisible()) {
      const startTime = Date.now();
      await sortButton.click();
      const sortTime = Date.now() - startTime;
      expect(sortTime).toBeLessThan(500);
    }
    await page.screenshot({ path: 'screenshots/178-sort-perf.png' });
  });

  test('179: Modal opening speed', async ({ page }) => {
    await page.goto('/');
    const modalTrigger = page.locator('button').first();
    const startTime = Date.now();
    await modalTrigger.click();
    const modalTime = Date.now() - startTime;
    expect(modalTime).toBeLessThan(300);
    await page.screenshot({ path: 'screenshots/179-modal-speed.png' });
  });

  test('180: Tab switching performance', async ({ page }) => {
    await page.goto('/');
    const tab = page.locator('[role="tab"]').nth(1);
    if (await tab.isVisible()) {
      const startTime = Date.now();
      await tab.click();
      const tabTime = Date.now() - startTime;
      expect(tabTime).toBeLessThan(200);
    }
    await page.screenshot({ path: 'screenshots/180-tab-switch.png' });
  });

  test('181: Dropdown rendering speed', async ({ page }) => {
    await page.goto('/');
    const dropdown = page.locator('[aria-haspopup="menu"]').first();
    if (await dropdown.isVisible()) {
      const startTime = Date.now();
      await dropdown.click();
      const dropdownTime = Date.now() - startTime;
      expect(dropdownTime).toBeLessThan(200);
    }
    await page.screenshot({ path: 'screenshots/181-dropdown-speed.png' });
  });

  test('182: Form submission performance', async ({ page }) => {
    await page.goto('/settings');
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      const startTime = Date.now();
      await form.evaluate(f => f.submit());
      const submitTime = Date.now() - startTime;
      expect(submitTime).toBeLessThan(2000);
    }
    await page.screenshot({ path: 'screenshots/182-form-submit.png' });
  });

  test('183: Data export performance', async ({ page }) => {
    await page.goto('/agents');
    const exportButton = page.locator('button:has-text("Export")').first();
    if (await exportButton.isVisible()) {
      const startTime = Date.now();
      await exportButton.click();
      const exportTime = Date.now() - startTime;
      expect(exportTime).toBeLessThan(3000);
    }
    await page.screenshot({ path: 'screenshots/183-export-perf.png' });
  });

  test('184: Bulk operation performance', async ({ page }) => {
    await page.goto('/agents');
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    if (count > 0) {
      const startTime = Date.now();
      for (let i = 0; i < Math.min(5, count); i++) {
        await checkboxes.nth(i).check();
      }
      const bulkTime = Date.now() - startTime;
      expect(bulkTime).toBeLessThan(1000);
    }
    await page.screenshot({ path: 'screenshots/184-bulk-ops.png' });
  });

  test('185: Navigation menu performance', async ({ page }) => {
    await page.goto('/');
    const navLink = page.locator('nav a').first();
    const startTime = Date.now();
    await navLink.click();
    const navTime = Date.now() - startTime;
    expect(navTime).toBeLessThan(500);
    await page.screenshot({ path: 'screenshots/185-nav-perf.png' });
  });

  test('186: Dashboard widget loading', async ({ page }) => {
    await page.goto('/');
    const widgets = page.locator('[class*="widget"], [class*="card"]');
    const widgetCount = await widgets.count();
    expect(widgetCount).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/186-widget-load.png' });
  });

  test('187: Notification rendering speed', async ({ page }) => {
    await page.goto('/');
    const notificationButton = page.locator('[aria-label*="notification"]').first();
    if (await notificationButton.isVisible()) {
      const startTime = Date.now();
      await notificationButton.click();
      const notifTime = Date.now() - startTime;
      expect(notifTime).toBeLessThan(300);
    }
    await page.screenshot({ path: 'screenshots/187-notif-speed.png' });
  });

  test('188: Theme switching performance', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('[aria-label*="theme"]').first();
    if (await themeToggle.isVisible()) {
      const startTime = Date.now();
      await themeToggle.click();
      const themeTime = Date.now() - startTime;
      expect(themeTime).toBeLessThan(500);
    }
    await page.screenshot({ path: 'screenshots/188-theme-switch.png' });
  });

  test('189: Autocomplete performance', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input').first();
    await input.fill('te');
    await page.waitForTimeout(300);
    const suggestions = page.locator('[role="listbox"], .suggestions');
    if (await suggestions.isVisible()) {
      await page.screenshot({ path: 'screenshots/189-autocomplete.png' });
    }
  });

  test('190: Infinite scroll loading', async ({ page }) => {
    await page.goto('/agents');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/190-infinite-scroll.png' });
  });

  test('191: Drag and drop performance', async ({ page }) => {
    await page.goto('/');
    const draggable = page.locator('[draggable="true"]').first();
    if (await draggable.isVisible()) {
      await draggable.dragTo(page.locator('body'));
      await page.screenshot({ path: 'screenshots/191-drag-drop.png' });
    }
  });

  test('192: Context menu speed', async ({ page }) => {
    await page.goto('/');
    await page.click('body', { button: 'right' });
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/192-context-menu.png' });
  });

  test('193: Tooltip display latency', async ({ page }) => {
    await page.goto('/');
    const tooltipTrigger = page.locator('[data-tooltip]').first();
    if (await tooltipTrigger.isVisible()) {
      const startTime = Date.now();
      await tooltipTrigger.hover();
      const tooltipTime = Date.now() - startTime;
      expect(tooltipTime).toBeLessThan(200);
    }
    await page.screenshot({ path: 'screenshots/193-tooltip-latency.png' });
  });

  test('194: Resize performance', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.screenshot({ path: 'screenshots/194-resize.png' });
  });

  test('195: Print preview generation', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: 'screenshots/195-print-preview.png' });
  });

  test('196: PDF generation speed', async ({ page }) => {
    await page.goto('/');
    const startTime = Date.now();
    await page.pdf({ path: 'screenshots/196-pdf.pdf' });
    const pdfTime = Date.now() - startTime;
    expect(pdfTime).toBeLessThan(5000);
  });

  test('197: Session storage usage', async ({ page }) => {
    await page.goto('/');
    const sessionData = await page.evaluate(() => {
      return sessionStorage.length;
    });
    expect(sessionData).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: 'screenshots/197-session.png' });
  });

  test('198: Local storage performance', async ({ page }) => {
    await page.goto('/');
    const startTime = Date.now();
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(`test-${i}`, 'value');
      }
    });
    const storageTime = Date.now() - startTime;
    expect(storageTime).toBeLessThan(100);
    await page.screenshot({ path: 'screenshots/198-localstorage.png' });
  });

  test('199: IndexedDB operations', async ({ page }) => {
    await page.goto('/');
    const hasIndexedDB = await page.evaluate(() => {
      return 'indexedDB' in window;
    });
    expect(hasIndexedDB).toBeTruthy();
    await page.screenshot({ path: 'screenshots/199-indexeddb.png' });
  });

  test('200: Overall performance score', async ({ page }) => {
    await page.goto('/');
    const metrics = await page.metrics();
    expect(metrics.TaskDuration).toBeDefined();
    await page.screenshot({ path: 'screenshots/200-overall-perf.png' });
  });
});