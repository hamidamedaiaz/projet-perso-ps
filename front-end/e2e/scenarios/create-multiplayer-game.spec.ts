import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { QuizAppFixture } from 'src/app/components/admin/admin_quizzes/quiz-app/quiz-app.fixture';
import { MultiplayerGameSetupSideBarFixture } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-game-setup-sidebar/multiplayer-game-setup-sidebar.fixture';
import { MultiplayerProfileListFixture } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-profile-list/multiplayer-profile-list.fixture';
import { OnlinePlayersFixture } from 'src/app/components/game/multiplayer/online-players/online-players.fixture';
import { AdminPageFixture } from 'src/app/pages/admin/admin-page/admin-page.fixtures';
import { HomeFixture } from 'src/app/pages/home/home.fixture';
import { PopUpCodeFixture } from 'src/app/popup-code/popup-code.fixture';

// This file is here to test the playwright integration.
test.describe('Create Multiplayer Game Test', () => {

  test('Create Multiplayer Game Test', async ({ page }) => {

    const homePageFixture = new HomeFixture(page);

    const popUpCodeFixture = new PopUpCodeFixture(page);

    const adminPageFixture = new AdminPageFixture(page);

    const quizAppFixture = new QuizAppFixture(page);

    const multiplayerGameSetupSideBarFixture = new MultiplayerGameSetupSideBarFixture(page);

    const onlinePlayersFixture = new OnlinePlayersFixture(page);

    const multiplayerProfileListFixture = new MultiplayerProfileListFixture(page);

    await page.goto(testUrl);

    await test.step("Access to admin page'", async () => {

      await homePageFixture.getAdminBtn().click();

      expect(popUpCodeFixture.getTitle()).toBeVisible();

      await popUpCodeFixture.getFirstInput().fill("1");
      await popUpCodeFixture.getSecondInput().fill("2");
      await popUpCodeFixture.getThirdInput().fill("3");
      await popUpCodeFixture.getFourthInput().fill("4");

      await expect(page).toHaveURL(/\/admin$/);

      await expect(adminPageFixture.getSideBarAccueilliBtn()).toBeVisible();

      await expect(adminPageFixture.getSideBarBackBtn()).toBeVisible();

      await expect(adminPageFixture.getSideBarQuizBtn()).toBeVisible();

      await expect(adminPageFixture.getSideBarStatsBtn()).toBeVisible();

    });

    await test.step("Select a quiz", async () => {

      const title = await adminPageFixture.getTitle();

      await expect(title).toBeVisible();

      await adminPageFixture.getSideBarQuizBtn().click();

      const quizList = quizAppFixture.getQuizList();

      await expect(quizList).toHaveCount(2);

      await quizAppFixture.getLaunchMultiBtnByName('Quiz Rock des années 70-80').click();

      await expect(multiplayerGameSetupSideBarFixture.getTitle()).toBeVisible();

      await expect(multiplayerGameSetupSideBarFixture.getBackBtn()).toBeVisible();

      await expect(multiplayerGameSetupSideBarFixture.getGameCode()).toBeVisible();

      await expect(multiplayerGameSetupSideBarFixture.getStartGameBtn()).toBeVisible();

      await expect(onlinePlayersFixture.getPlayers()).toHaveCount(0);

      await expect(onlinePlayersFixture.getTitle()).toBeVisible();

      await expect(multiplayerProfileListFixture.getPlayers()).toHaveCount(0);

      await expect(multiplayerProfileListFixture.getTitle()).toBeVisible();

    });

  });

});


