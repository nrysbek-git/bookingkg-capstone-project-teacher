const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const outputDirectory = path.resolve(__dirname, '../../docs/screenshots');
const baseUrl = process.env.APP_URL || 'http://localhost:8080';
const email = `docs-${Date.now()}@cloudops.local`;
const password = 'CloudOps123!';

async function capture(page, filename) {
  await page.screenshot({
    path: path.join(outputDirectory, filename),
    fullPage: true
  });
}

(async () => {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await capture(page, 'sign-in.png');

  await page.getByRole('button', { name: 'Create account' }).first().click();
  await capture(page, 'register.png');
  await page.getByLabel('Full name').fill('Alex Morgan');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('.auth-card').getByRole('button', { name: 'Create account' }).click();
  await page.getByText('Sign in to your workspace').waitFor();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.locator('.auth-card').getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Build practical cloud engineering skills.').waitFor();
  await capture(page, 'dashboard.png');

  await page.getByRole('button', { name: 'Assessment' }).click();
  await page.getByText('DevOps foundations').waitFor();
  await capture(page, 'assessment.png');

  await page.getByRole('button', { name: 'Leaderboard' }).click();
  await page.getByText('DevOps leaderboard').waitFor();
  await capture(page, 'leaderboard.png');

  await page.getByRole('button', { name: 'API' }).click();
  await page.waitForTimeout(1500);
  await capture(page, 'api-docs.png');

  await browser.close();
  console.log(`Screenshots saved in ${outputDirectory}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
