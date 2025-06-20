import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { AdminPageFixture } from 'src/app/pages/admin/admin-page/admin-page.fixture';
import { HomeFixture } from 'src/app/pages/home/home.fixture';
import { ProfileListFixture } from 'src/app/components/admin/profiles/profile-list/profile-list.fixture';
import { ProfileConfigurationFixture } from 'src/app/components/admin/profiles/profile-configuration/profile-configuration.fixture';
import { PopUpCodeFixture } from 'src/app/popup-code/popup-code.fixture';

// This file is here to test the management of users
test.describe('User Management Test', () => {

  test('Manage User', async ({page}) => {

    const homePageFixture = new HomeFixture(page);
    const popUpCodeFixture = new PopUpCodeFixture(page);
    const adminPageFixture = new AdminPageFixture(page);
    const profileListFixture = new ProfileListFixture(page);
    const profileConfigurationFixture = new ProfileConfigurationFixture(page);

    await page.goto(testUrl)

    await test.step("Access to admin page", async () => {
      await homePageFixture.getAdminBtn().click();
      await expect(popUpCodeFixture.getTitle()).toBeVisible();
      await popUpCodeFixture.getFirstInput().fill("1");
      await popUpCodeFixture.getSecondInput().fill("2");
      await popUpCodeFixture.getThirdInput().fill("3");
      await popUpCodeFixture.getFourthInput().fill("4");
      await expect(page).toHaveURL(/\/admin$/);
    })

    await test.step("Access to the user configuration page", async () => {
      await adminPageFixture.getSideBarAccueilliBtn().click();
      await expect(profileListFixture.getAddUserBtn()).toBeVisible();
    })

    await test.step("Create a new user", async () => {
      await profileListFixture.getAddUserBtn().click();
      await expect(profileListFixture.getModalContainer()).toBeVisible();
      await profileListFixture.getModalFirstNameInput().fill("John");
      await profileListFixture.getModalLastNameInput().fill("Smith");
      await profileListFixture.getModalSaveBtn().click();
      await expect(profileListFixture.getUserByName("John Smith")).toBeVisible();
    })

    await test.step("Access the new user configuration", async () => {
      await profileListFixture.getUserByName("John Smith").click();
      await expect(profileConfigurationFixture.getUserFirstNameInput()).toHaveValue('John');
      await expect(profileConfigurationFixture.getUserLastNameInput()).toHaveValue('Smith');
      await expect(profileListFixture.getConfigPanel()).toBeVisible();
    })

    await test.step("Modify the new user configuration", async () => {
      await profileConfigurationFixture.getUserFirstNameInput().fill('Neil');
      await profileConfigurationFixture.getHintTimerSelector().selectOption('45 secondes');
      await profileConfigurationFixture.getRelaunchTimerSelector().selectOption('30 secondes');
      await profileConfigurationFixture.getRemoveAnswerTimerSelector().selectOption('1 minute');
      await profileConfigurationFixture.getHintCountSelector().selectOption('3');
      await profileConfigurationFixture.getAnswerCountSelector().selectOption('2');
      await profileConfigurationFixture.getFontSizeSelector().selectOption('Petit');
      await profileConfigurationFixture.getSaveBtn().click();
    })

    await test.step("Verify the new user configuration", async () => {
      await profileListFixture.getUserByName("Neil Smith").click();
      await expect(profileConfigurationFixture.getUserFirstNameInput()).toHaveValue('Neil');
      await expect(profileConfigurationFixture.getHintTimerSelector()).toHaveValue('45000');
      await expect(profileConfigurationFixture.getRelaunchTimerSelector()).toHaveValue('30000');
      await expect(profileConfigurationFixture.getRemoveAnswerTimerSelector()).toHaveValue('60000');
      await expect(profileConfigurationFixture.getHintCountSelector()).toHaveValue('3');
      await expect(profileConfigurationFixture.getAnswerCountSelector()).toHaveValue('2');
      await expect(profileConfigurationFixture.getFontSizeSelector()).toHaveValue('0.75');
      await profileConfigurationFixture.getCancelBtn().click();
    })

    await test.step("Delete the new user", async () => {
      await profileListFixture.getDeleteBtnForUser("Neil Smith").click();
      await expect(profileListFixture.getDeletePopUp()).toBeVisible();
      await profileListFixture.getConfirmDeleteBtn().click();
      await expect(profileListFixture.getUserByName("Neil Smith")).not.toBeVisible();
    })
  })
});
