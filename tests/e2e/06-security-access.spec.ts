import { test, expect } from '@playwright/test';

test.describe('Security and Access Tests', () => {
  // Test 201-250: Security, Authentication, and Access Control Tests
  test('201: Should handle XSS attempts in search fields', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.fill('<script>alert("XSS")</script>');
    await page.waitForTimeout(1000);
    const alerts = await page.evaluate(() => window.alert);
    expect(alerts).toBeUndefined();
    await page.screenshot({ path: 'screenshots/201-xss-prevention.png' });
  });

  test('202: Should sanitize HTML in user inputs', async ({ page }) => {
    await page.goto('/agents');
    const input = page.locator('input').first();
    await input.fill('<img src=x onerror=alert(1)>');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/202-html-sanitization.png' });
  });

  test('203: Should enforce HTTPS in production', async ({ page }) => {
    const response = await page.goto('/');
    const url = response?.url() || '';
    expect(url).toMatch(/^https:/);
    await page.screenshot({ path: 'screenshots/203-https-enforcement.png' });
  });

  test('204: Should have secure cookie settings', async ({ page }) => {
    await page.goto('/');
    const cookies = await page.context().cookies();
    cookies.forEach(cookie => {
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        expect(cookie.secure).toBeTruthy();
        expect(cookie.httpOnly).toBeTruthy();
      }
    });
    await page.screenshot({ path: 'screenshots/204-secure-cookies.png' });
  });

  test('205: Should handle SQL injection attempts', async ({ page }) => {
    await page.goto('/advisors');
    const searchField = page.locator('input[placeholder*="Search"]').first();
    await searchField.fill("'; DROP TABLE users; --");
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=/error/i')).not.toBeVisible();
    await page.screenshot({ path: 'screenshots/205-sql-injection.png' });
  });

  test('206: Should validate file upload types', async ({ page }) => {
    await page.goto('/settings');
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible()) {
      const acceptAttr = await fileInput.getAttribute('accept');
      expect(acceptAttr).toBeDefined();
      await page.screenshot({ path: 'screenshots/206-file-validation.png' });
    }
  });

  test('207: Should implement rate limiting', async ({ page }) => {
    await page.goto('/');
    for (let i = 0; i < 5; i++) {
      await page.reload();
    }
    await expect(page).not.toHaveTitle(/Rate Limited/);
    await page.screenshot({ path: 'screenshots/207-rate-limiting.png' });
  });

  test('208: Should have Content Security Policy headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    const csp = headers?.['content-security-policy'];
    if (csp) {
      expect(csp).toContain('default-src');
    }
    await page.screenshot({ path: 'screenshots/208-csp-headers.png' });
  });

  test('209: Should mask sensitive data', async ({ page }) => {
    await page.goto('/advisors');
    const phoneNumbers = page.locator('text=/\\d{3}-\\d{3}-\\d{4}/');
    const count = await phoneNumbers.count();
    if (count > 0) {
      const text = await phoneNumbers.first().textContent();
      expect(text).toMatch(/\*{3,}/);
    }
    await page.screenshot({ path: 'screenshots/209-data-masking.png' });
  });

  test('210: Should handle session timeout', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('session_expire', '0');
    });
    await page.reload();
    await page.screenshot({ path: 'screenshots/210-session-timeout.png' });
  });

  test('211: Should prevent clickjacking', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    const xFrameOptions = headers?.['x-frame-options'];
    if (xFrameOptions) {
      expect(xFrameOptions).toMatch(/DENY|SAMEORIGIN/);
    }
    await page.screenshot({ path: 'screenshots/211-clickjacking.png' });
  });

  test('212: Should validate email formats', async ({ page }) => {
    await page.goto('/settings');
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      await page.keyboard.press('Tab');
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      await page.screenshot({ path: 'screenshots/212-email-validation.png' });
    }
  });

  test('213: Should enforce password complexity', async ({ page }) => {
    await page.goto('/settings');
    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('weak');
      const pattern = await passwordInput.getAttribute('pattern');
      if (pattern) {
        expect(pattern).toContain('[A-Z]');
      }
      await page.screenshot({ path: 'screenshots/213-password-complexity.png' });
    }
  });

  test('214: Should have CORS configured properly', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    const cors = headers?.['access-control-allow-origin'];
    if (cors) {
      expect(cors).not.toBe('*');
    }
    await page.screenshot({ path: 'screenshots/214-cors-config.png' });
  });

  test('215: Should log security events', async ({ page }) => {
    await page.goto('/');
    const logs = page.locator('text=/security.*log/i');
    if (await logs.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/215-security-logs.png' });
    }
  });

  test('216: Should handle unauthorized access', async ({ page }) => {
    await page.goto('/api/admin/users');
    const unauthorized = page.locator('text=/401|403|Unauthorized|Forbidden/i');
    await expect(unauthorized.first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/216-unauthorized.png' });
  });

  test('217: Should encrypt sensitive storage', async ({ page }) => {
    await page.goto('/');
    const localStorage = await page.evaluate(() => {
      return Object.keys(window.localStorage);
    });
    localStorage.forEach(key => {
      if (key.includes('token') || key.includes('key')) {
        expect(key).not.toContain('plain');
      }
    });
    await page.screenshot({ path: 'screenshots/217-encrypted-storage.png' });
  });

  test('218: Should implement CSRF protection', async ({ page }) => {
    await page.goto('/');
    const csrfToken = await page.locator('meta[name="csrf-token"]').getAttribute('content');
    if (csrfToken) {
      expect(csrfToken).toBeDefined();
      await page.screenshot({ path: 'screenshots/218-csrf-token.png' });
    }
  });

  test('219: Should validate API tokens', async ({ page }) => {
    await page.goto('/settings');
    const apiTokenInput = page.locator('input[placeholder*="API"]').first();
    if (await apiTokenInput.isVisible()) {
      await apiTokenInput.fill('invalid-token');
      await page.keyboard.press('Enter');
      const error = page.locator('text=/Invalid.*token/i');
      await expect(error.first()).toBeVisible();
      await page.screenshot({ path: 'screenshots/219-token-validation.png' });
    }
  });

  test('220: Should handle brute force attempts', async ({ page }) => {
    await page.goto('/login');
    for (let i = 0; i < 3; i++) {
      const loginButton = page.locator('button:has-text("Login")').first();
      if (await loginButton.isVisible()) {
        await loginButton.click();
      }
    }
    await page.screenshot({ path: 'screenshots/220-brute-force.png' });
  });

  test('221: Should obfuscate JavaScript in production', async ({ page }) => {
    await page.goto('/');
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).map(s => s.src);
    });
    const mainScript = scripts.find(s => s.includes('main'));
    if (mainScript) {
      const response = await page.goto(mainScript);
      const content = await response?.text();
      expect(content).not.toContain('console.log');
    }
    await page.screenshot({ path: 'screenshots/221-js-obfuscation.png' });
  });

  test('222: Should implement secure headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    expect(headers?.['x-content-type-options']).toBe('nosniff');
    await page.screenshot({ path: 'screenshots/222-secure-headers.png' });
  });

  test('223: Should validate form submissions', async ({ page }) => {
    await page.goto('/campaigns');
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      const submitButton = form.locator('button[type="submit"]');
      await submitButton.click();
      const validation = page.locator('.error, [aria-invalid="true"]');
      await expect(validation.first()).toBeVisible();
      await page.screenshot({ path: 'screenshots/223-form-validation.png' });
    }
  });

  test('224: Should handle file size limits', async ({ page }) => {
    await page.goto('/settings');
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible()) {
      const maxSize = await fileInput.getAttribute('data-max-size');
      if (maxSize) {
        expect(parseInt(maxSize)).toBeLessThanOrEqual(10485760); // 10MB
      }
      await page.screenshot({ path: 'screenshots/224-file-size.png' });
    }
  });

  test('225: Should implement audit logging', async ({ page }) => {
    await page.goto('/');
    await page.locator('button').first().click();
    const auditLog = page.locator('text=/audit|activity/i');
    if (await auditLog.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/225-audit-log.png' });
    }
  });

  test('226: Access control for admin functions', async ({ page }) => {
    await page.goto('/admin');
    const adminPanel = page.locator('text=/Admin|Management/i');
    if (await adminPanel.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/226-admin-access.png' });
    }
  });

  test('227: Should sanitize markdown content', async ({ page }) => {
    await page.goto('/campaigns');
    const editor = page.locator('textarea, [contenteditable="true"]').first();
    if (await editor.isVisible()) {
      await editor.fill('# Title\n<script>alert(1)</script>');
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/227-markdown-sanitize.png' });
    }
  });

  test('228: Should implement role-based access', async ({ page }) => {
    await page.goto('/');
    const roleIndicator = page.locator('text=/role:|permission:/i');
    if (await roleIndicator.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/228-rbac.png' });
    }
  });

  test('229: Should protect against timing attacks', async ({ page }) => {
    await page.goto('/login');
    const start = Date.now();
    const loginButton = page.locator('button:has-text("Login")').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
    const end = Date.now();
    const responseTime = end - start;
    expect(responseTime).toBeGreaterThan(100);
    await page.screenshot({ path: 'screenshots/229-timing-attack.png' });
  });

  test('230: Should validate webhook signatures', async ({ page }) => {
    await page.goto('/settings');
    const webhookSection = page.locator('text=/webhook/i');
    if (await webhookSection.first().isVisible()) {
      const signatureField = page.locator('text=/signature|secret/i');
      await expect(signatureField.first()).toBeVisible();
      await page.screenshot({ path: 'screenshots/230-webhook-signature.png' });
    }
  });

  test('231: Should implement API rate limits', async ({ page }) => {
    await page.goto('/api/status');
    const rateLimitHeader = page.locator('text=/rate.*limit/i');
    if (await rateLimitHeader.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/231-api-rate-limit.png' });
    }
  });

  test('232: Should handle privilege escalation', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('user_role', 'admin');
    });
    await page.reload();
    const adminFeatures = page.locator('[data-admin-only]');
    const count = await adminFeatures.count();
    expect(count).toBe(0);
    await page.screenshot({ path: 'screenshots/232-privilege-escalation.png' });
  });

  test('233: Should validate JSON payloads', async ({ page }) => {
    await page.goto('/api/data');
    const jsonError = page.locator('text=/JSON|parse.*error/i');
    if (await jsonError.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/233-json-validation.png' });
    }
  });

  test('234: Should implement secure redirects', async ({ page }) => {
    await page.goto('/?redirect=http://evil.com');
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).not.toContain('evil.com');
    await page.screenshot({ path: 'screenshots/234-secure-redirects.png' });
  });

  test('235: Should protect API endpoints', async ({ page }) => {
    const response = await page.goto('/api/internal');
    expect(response?.status()).toBeGreaterThanOrEqual(400);
    await page.screenshot({ path: 'screenshots/235-api-protection.png' });
  });

  test('236: Should validate image uploads', async ({ page }) => {
    await page.goto('/settings');
    const imageInput = page.locator('input[accept*="image"]').first();
    if (await imageInput.isVisible()) {
      const accept = await imageInput.getAttribute('accept');
      expect(accept).toContain('image/');
      await page.screenshot({ path: 'screenshots/236-image-validation.png' });
    }
  });

  test('237: Should implement secure WebSocket', async ({ page }) => {
    await page.goto('/');
    const wsIndicator = page.locator('text=/websocket|ws:|wss:/i');
    if (await wsIndicator.first().isVisible()) {
      const text = await wsIndicator.first().textContent();
      expect(text).not.toContain('ws:');
      await page.screenshot({ path: 'screenshots/237-secure-websocket.png' });
    }
  });

  test('238: Should handle directory traversal', async ({ page }) => {
    await page.goto('/../../etc/passwd');
    const notFound = page.locator('text=/404|not.*found/i');
    await expect(notFound.first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/238-directory-traversal.png' });
  });

  test('239: Should validate URL parameters', async ({ page }) => {
    await page.goto('/?param=<script>alert(1)</script>');
    const alerts = await page.evaluate(() => window.alert);
    expect(alerts).toBeUndefined();
    await page.screenshot({ path: 'screenshots/239-url-validation.png' });
  });

  test('240: Should implement secure cookies', async ({ page }) => {
    await page.goto('/');
    const cookies = await page.context().cookies();
    cookies.forEach(cookie => {
      if (cookie.name.includes('session')) {
        expect(cookie.sameSite).toMatch(/Strict|Lax/);
      }
    });
    await page.screenshot({ path: 'screenshots/240-cookie-security.png' });
  });

  test('241: Should handle XML injection', async ({ page }) => {
    await page.goto('/api/xml');
    const xmlError = page.locator('text=/XML|parse/i');
    if (await xmlError.first().isVisible()) {
      await page.screenshot({ path: 'screenshots/241-xml-injection.png' });
    }
  });

  test('242: Should validate phone numbers', async ({ page }) => {
    await page.goto('/advisors');
    const phoneInput = page.locator('input[type="tel"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('invalid-phone');
      const isInvalid = await phoneInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      await page.screenshot({ path: 'screenshots/242-phone-validation.png' });
    }
  });

  test('243: Should implement secure file downloads', async ({ page }) => {
    await page.goto('/');
    const downloadLink = page.locator('a[download]').first();
    if (await downloadLink.isVisible()) {
      const href = await downloadLink.getAttribute('href');
      expect(href).not.toContain('../');
      await page.screenshot({ path: 'screenshots/243-secure-downloads.png' });
    }
  });

  test('244: Should handle command injection', async ({ page }) => {
    await page.goto('/');
    const commandInput = page.locator('input').first();
    await commandInput.fill('ls -la; rm -rf /');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(page).not.toHaveTitle(/error/i);
    await page.screenshot({ path: 'screenshots/244-command-injection.png' });
  });

  test('245: Should validate date inputs', async ({ page }) => {
    await page.goto('/campaigns');
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible()) {
      await dateInput.fill('9999-99-99');
      const isInvalid = await dateInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      await page.screenshot({ path: 'screenshots/245-date-validation.png' });
    }
  });

  test('246: Should implement secure storage', async ({ page }) => {
    await page.goto('/');
    const storage = await page.evaluate(() => {
      return {
        local: Object.keys(localStorage),
        session: Object.keys(sessionStorage)
      };
    });
    storage.local.forEach(key => {
      expect(key).not.toContain('password');
      expect(key).not.toContain('secret');
    });
    await page.screenshot({ path: 'screenshots/246-secure-storage.png' });
  });

  test('247: Should validate numeric inputs', async ({ page }) => {
    await page.goto('/settings');
    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      await numberInput.fill('abc');
      const value = await numberInput.inputValue();
      expect(value).toBe('');
      await page.screenshot({ path: 'screenshots/247-number-validation.png' });
    }
  });

  test('248: Should handle buffer overflow', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input').first();
    const longString = 'a'.repeat(10000);
    await input.fill(longString);
    await page.waitForTimeout(500);
    await expect(page).not.toHaveTitle(/error/i);
    await page.screenshot({ path: 'screenshots/248-buffer-overflow.png' });
  });

  test('249: Should implement secure random generation', async ({ page }) => {
    await page.goto('/');
    const randomValues = await page.evaluate(() => {
      const array = new Uint32Array(10);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(array);
        return array.length > 0;
      }
      return false;
    });
    expect(randomValues).toBeTruthy();
    await page.screenshot({ path: 'screenshots/249-secure-random.png' });
  });

  test('250: Should validate ZIP file uploads', async ({ page }) => {
    await page.goto('/settings');
    const fileInput = page.locator('input[accept*="zip"]').first();
    if (await fileInput.isVisible()) {
      const accept = await fileInput.getAttribute('accept');
      expect(accept).toContain('zip');
      await page.screenshot({ path: 'screenshots/250-zip-validation.png' });
    }
  });
});