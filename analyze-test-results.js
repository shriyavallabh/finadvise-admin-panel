#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n================================');
console.log('TEST RESULTS ANALYSIS');
console.log('================================\n');

// Check for test result files
const testResultsDir = path.join(__dirname, 'test-results');
const screenshotsDir = path.join(__dirname, 'screenshots');

// Count screenshots
if (fs.existsSync(screenshotsDir)) {
  const screenshots = fs.readdirSync(screenshotsDir);
  console.log(`✓ Screenshots captured: ${screenshots.length}`);
  console.log(`  Directory: ${screenshotsDir}`);
} else {
  console.log('✗ No screenshots directory found');
}

// Check for test result JSON
const resultsJsonPath = path.join(testResultsDir, 'results.json');
if (fs.existsSync(resultsJsonPath)) {
  const results = JSON.parse(fs.readFileSync(resultsJsonPath, 'utf8'));

  console.log('\nTest Summary:');
  console.log(`  Total tests: ${results.stats?.total || 0}`);
  console.log(`  Passed: ${results.stats?.passed || 0}`);
  console.log(`  Failed: ${results.stats?.failed || 0}`);
  console.log(`  Skipped: ${results.stats?.skipped || 0}`);
  console.log(`  Duration: ${results.stats?.duration || 0}ms`);

  if (results.errors && results.errors.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error.title || 'Unknown test'}`);
      console.log(`     File: ${error.file || 'Unknown'}`);
      console.log(`     Error: ${error.message || 'Unknown error'}`);
    });
  }
} else {
  console.log('\n⚠️  No JSON results file found at', resultsJsonPath);
}

// List major issues found from test naming
console.log('\n================================');
console.log('IDENTIFIED ISSUES TO FIX:');
console.log('================================\n');

const issues = [
  '1. Missing glassmorphism effects (backdrop-blur classes)',
  '2. No sidebar navigation element with role="navigation"',
  '3. Navigation links (Agents, Settings) not found',
  '4. Routing not working properly',
  '5. Mobile menu toggle not functioning',
  '6. Breadcrumbs not visible',
  '7. Active nav items not highlighted',
  '8. Logo not linking to home',
];

issues.forEach(issue => console.log(`  ${issue}`));

console.log('\n================================');
console.log('RECOMMENDED FIXES:');
console.log('================================\n');

const fixes = [
  '• Add backdrop-blur-md classes to dashboard cards',
  '• Add role="navigation" to sidebar component',
  '• Create proper navigation links with text labels',
  '• Implement client-side routing with Next.js Link components',
  '• Add mobile hamburger menu with toggle functionality',
  '• Add breadcrumb navigation component',
  '• Style active navigation items',
  '• Make logo clickable with link to home',
];

fixes.forEach(fix => console.log(`  ${fix}`));

console.log('\n================================\n');