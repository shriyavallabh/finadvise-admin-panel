#!/bin/bash

echo "Starting comprehensive test suite of 300 tests..."
echo "Testing URL: https://finadvise-admin-panel.vercel.app"
echo "================================"

# Create directories for results
mkdir -p screenshots
mkdir -p test-results

# Run all test files
echo "Running Dashboard Core Tests (1-20)..."
npx playwright test tests/e2e/01-dashboard-core.spec.ts --reporter=list --project=chromium

echo "Running Navigation Tests (21-50)..."
npx playwright test tests/e2e/02-navigation.spec.ts --reporter=list --project=chromium

echo "Running Agent Management Tests (51-100)..."
npx playwright test tests/e2e/03-agent-management.spec.ts --reporter=list --project=chromium

echo "Running Visual UI Tests (101-150)..."
npx playwright test tests/e2e/04-visual-ui.spec.ts --reporter=list --project=chromium

echo "Running Performance Tests (151-200)..."
npx playwright test tests/e2e/05-performance.spec.ts --reporter=list --project=chromium

echo "Running Security Tests (201-250)..."
npx playwright test tests/e2e/06-security-access.spec.ts --reporter=list --project=chromium

echo "Running Accessibility Tests (251-300)..."
npx playwright test tests/e2e/07-accessibility-mobile.spec.ts --reporter=list --project=chromium

echo "================================"
echo "All tests completed!"
echo "Check screenshots/ directory for captured images"
echo "Check test-results/ directory for detailed reports"