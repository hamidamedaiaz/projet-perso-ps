import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { AdminPageFixtures } from 'src/app/pages/admin/admin-page/admin-page.fixtures';
import { HomeFixture } from 'src/app/pages/home/home.fixture';

// This file is here to test the playwright integration.
test.describe('Monitoring Multiplayer Game Test', () => {

  test('Access to admin page', async ({page}) => {
    await page.goto(testUrl)

    const homePageFixture = new HomeFixture(page);

    const adminPageFixture = new AdminPageFixtures(page);

    const description = await adminPageFixture.getTitle();

    expect(description).toBeVisible();
  })
});


