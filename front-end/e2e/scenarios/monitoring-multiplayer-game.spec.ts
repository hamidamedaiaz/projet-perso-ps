import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { AppFixture } from 'src/app/app.fixture';

// This file is here to test the playwright integration.
test.describe('Monitoring Multiplayer Game Test', () => {
  test('Basic test', async ({ page }) => {
    await page.goto(testUrl);
    // Let's try with something you don't have in your page.
    const pageTitle = await page.getByRole('heading', { name: 'AGreatHeadingNameYouDontHave' });
    // It should not be visible as you don't have it in your page.
    expect(pageTitle).not.toBeVisible();
    // Test case pass? Means the playwright setup is done! Congrats!
  });

  test('Access to admin page', async ({page}) => {
    await page.goto(testUrl)

    const appComponentFixture = new AppFixture(page);

    const description = await page.locator('/html/body/app-root/app-admin/html/body/div/main/div/span');

    expect(description).toBeVisible();
  })
});


