import { test, expect, chromium } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { QuizAppFixture } from 'src/app/components/admin/admin_quizzes/quiz-app/quiz-app.fixture';
import { MultiplayerInGameListFixture } from 'src/app/components/game/multiplayer/multi-player-in-game-list/multiplayer-in-game-list.fixture';
import { MultiplayerGameSetupSideBarFixture } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-game-setup-sidebar/multiplayer-game-setup-sidebar.fixture';
import { MultiplayerProfileListFixture } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-profile-list/multiplayer-profile-list.fixture';
import { OnlinePlayersFixture } from 'src/app/components/game/multiplayer/online-players/online-players.fixture';
import { QuizQuestionFixture } from 'src/app/components/game/quizzes/quiz-question/quiz-question.fixture';
import { AdminPageFixture } from 'src/app/pages/admin/admin-page/admin-page.fixture';
import { GamemodeSelectionFixture } from 'src/app/pages/game/gamemode-selection-page/gamemode-selection.fixture';
import { AnswerSubmittedPageFixture } from 'src/app/pages/game/multiplayer-game/answer-submitted-page/answer-submitted-page.fixture';
import { MultiplayerGameLoginPageFixture } from 'src/app/pages/game/multiplayer-game/multiplayer-game-login-page/multiplayer-game-login-page.fixture';
import { QuizMultiplayerScoreboardFixture } from 'src/app/pages/game/multiplayer-game/quiz-multiplayer-scoreboard/quiz-multiplayer-scoreboard.fixture';
import { WaitingStartPageFixture } from 'src/app/pages/game/multiplayer-game/waiting-start-page/waiting-start-page.fixture';
import { HomeFixture } from 'src/app/pages/home/home.fixture';
import { PopUpCodeFixture } from 'src/app/popup-code/popup-code.fixture';

test.setTimeout(60000);

// This file is here to test the playwright integration.
test.describe('Monitor Multiplayer Game Test', () => {

  test('Monitor Multiplayer Game Test', async () => {

    // DEFINE CONTEXT

    const brower = await chromium.launch();

    const adminContext = await brower.newContext();

    const accueilliContext = await brower.newContext();

    const pageAdmin = await adminContext.newPage();

    await pageAdmin.goto(testUrl);

    const pageAccueilli = await accueilliContext.newPage();

    await pageAccueilli.goto(testUrl);

    // FIXTURES

    const AdminhomePageFixture = new HomeFixture(pageAdmin);

    const popUpCodeFixture = new PopUpCodeFixture(pageAdmin);

    const adminPageFixture = new AdminPageFixture(pageAdmin);

    const quizAppFixture = new QuizAppFixture(pageAdmin);

    const multiplayerGameSetupSideBarFixture = new MultiplayerGameSetupSideBarFixture(pageAdmin);

    const onlinePlayersFixture = new OnlinePlayersFixture(pageAdmin);

    const multiplayerProfileListFixture = new MultiplayerProfileListFixture(pageAdmin);

    const AccueilliHomePageFixture = new HomeFixture(pageAccueilli);

    const gamemodeSelectionFixture = new GamemodeSelectionFixture(pageAccueilli);

    const multiplayerGameLoginPageFixture = new MultiplayerGameLoginPageFixture(pageAccueilli);

    const waitingStartPageFixture = new WaitingStartPageFixture(pageAccueilli);

    const accueilliQuestionFixture = new QuizQuestionFixture(pageAccueilli);

    const adminQuestionFixture = new QuizQuestionFixture(pageAdmin);

    const adminMultiplayerInGameListFixture = new MultiplayerInGameListFixture(pageAdmin);

    const answerSubmittedFixture = new AnswerSubmittedPageFixture(pageAccueilli);

    const adminScoreboardFixture = new QuizMultiplayerScoreboardFixture(pageAdmin);

    const accueilliScoreboardFixture = new QuizMultiplayerScoreboardFixture(pageAccueilli);

    // STEPS
    let session_code: string | null = null;

    await test.step("Intervenant - Access to admin page'", async () => {

      await AdminhomePageFixture.getAdminBtn().click();

      expect(popUpCodeFixture.getTitle()).toBeVisible();

      await popUpCodeFixture.getFirstInput().fill("1");
      await popUpCodeFixture.getSecondInput().fill("2");
      await popUpCodeFixture.getThirdInput().fill("3");
      await popUpCodeFixture.getFourthInput().fill("4");

      await expect(pageAdmin).toHaveURL(/\/admin$/);

      await expect(adminPageFixture.getSideBarAccueilliBtn()).toBeVisible();

      await expect(adminPageFixture.getSideBarBackBtn()).toBeVisible();

      await expect(adminPageFixture.getSideBarQuizBtn()).toBeVisible();

      await expect(adminPageFixture.getSideBarStatsBtn()).toBeVisible();

    });

    await test.step("Intervenant - Select a quiz", async () => {

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

      session_code = await multiplayerGameSetupSideBarFixture.getGameCode().textContent();

    });

    await test.step("Accueilli - Selection profile", async () => {
      const card = AccueilliHomePageFixture.getCardByName("Jean Dupont");
      await card.click();
      await expect(pageAccueilli).toHaveURL(testUrl +"/gamemode-selection");
      await expect(onlinePlayersFixture.getPlayers()).toHaveCount(1);
    });

    await test.step("Accueilli - Selection mode de jeu", async () => {

      const multiplayerBtn = gamemodeSelectionFixture.getMultiplayerButton();

      await multiplayerBtn.click({ force: true });

      await expect(pageAccueilli).toHaveURL(testUrl +"/multiplayer-game-login");

      await expect(multiplayerGameLoginPageFixture.getMessage()).toBeVisible();

      await expect(multiplayerGameLoginPageFixture.getBackBtn()).toBeVisible();

      await expect(multiplayerGameLoginPageFixture.getCodeInput()).toBeVisible();

      await expect(multiplayerGameLoginPageFixture.getJoinSessionBtn()).toBeVisible();

      await multiplayerGameLoginPageFixture.getJoinSessionBtn().click();

      await expect(multiplayerGameLoginPageFixture.getJoinSessionBtn()).toBeVisible();

      await multiplayerGameLoginPageFixture.getJoinSessionBtn().click();

      await expect(multiplayerGameLoginPageFixture.getMessage()).toHaveText("Code Invalide");

      if (session_code) await multiplayerGameLoginPageFixture.getCodeInput().fill(session_code);

      await multiplayerGameLoginPageFixture.getJoinSessionBtn().click();

      await expect(multiplayerProfileListFixture.getPlayers()).toHaveCount(1);

      await expect(onlinePlayersFixture.getPlayers()).toHaveCount(0);

      await expect(pageAccueilli).toHaveURL(testUrl +"/waiting-start");

      await expect(waitingStartPageFixture.getTutorialBtn()).toBeVisible();

      await expect(waitingStartPageFixture.getCancelBtn()).toBeVisible();

      await expect(waitingStartPageFixture.getMessage()).toBeVisible();

      await expect(waitingStartPageFixture.getMessage()).toHaveText("En attente du début de la partie");

    })

    await test.step("Admin - Retirer le joueur de la session", async () => {

      await multiplayerProfileListFixture.getKickBtnByName('Jean Dupont').click();

      await expect(onlinePlayersFixture.getPlayers()).toHaveCount(1);

      await expect(pageAccueilli).toHaveURL(testUrl +"/multiplayer-game-login");

      await expect(multiplayerGameLoginPageFixture.getMessage()).toBeVisible();
      await expect(multiplayerGameLoginPageFixture.getBackBtn()).toBeVisible();
      await expect(multiplayerGameLoginPageFixture.getCodeInput()).toBeVisible();
      await expect(multiplayerGameLoginPageFixture.getJoinSessionBtn()).toBeVisible();

      await onlinePlayersFixture.getMovePlayerBtnByName('Jean Dupont').click();

      await expect(multiplayerProfileListFixture.getPlayers()).toHaveCount(1);

      await expect(onlinePlayersFixture.getPlayers()).toHaveCount(0);
    });

    await test.step("Admin - Démarrer la session", async () => {

      await multiplayerGameSetupSideBarFixture.getStartGameBtn().click();

      await expect(pageAccueilli).toHaveURL(testUrl +"/multiplayer-game")
      await expect(pageAdmin).toHaveURL(testUrl +"/multiplayer-game")

    })

    await test.step('Accueilli - Click sur une réponse correcte', async () => {

      await expect(adminMultiplayerInGameListFixture.getProfiles()).toHaveCount(0);

      await expect(adminQuestionFixture.getAnswerCounter()).toHaveText("Réponses: 0/1");

      await accueilliQuestionFixture.getAnswerByName("Queen").click();

      await expect(adminMultiplayerInGameListFixture.getProfiles()).toHaveCount(1);

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" Queen - 100% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" Genesis - 0% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" The Rolling Stones - 0% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" The Beatles - 0% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerCounter()).toHaveText("Réponses: 1/1");

      await expect(pageAccueilli).toHaveURL(testUrl +"/answer-submitted");

      await expect(answerSubmittedFixture.getAnswerSavedMessage()).not.toBeVisible();

      await expect(answerSubmittedFixture.getAnswerResultMessage()).toBeVisible();

      await expect(answerSubmittedFixture.getAnswerResultMessage()).toHaveText("Bonne réponse !");

    })

    await test.step('Admin - Passage à la question suivante', async () => {

      await adminQuestionFixture.getNextQuestionBtn().click();

      await expect(pageAccueilli).toHaveURL(testUrl +"/multiplayer-game")

      await expect(pageAdmin).toHaveURL(testUrl +"/multiplayer-game")

    })

    await test.step('Admin - Afficher les indices', async () => {

      await adminQuestionFixture.getToogleHintsBtn().click();

      await expect(adminQuestionFixture.getHints()).toBeVisible();

      await adminQuestionFixture.getToogleHintsBtn().click();

      await expect(adminQuestionFixture.getHints()).not.toBeVisible();
    })

    await test.step('Accueilli - Click sur une réponse incorrecte', async () => {

      await expect(adminMultiplayerInGameListFixture.getProfiles()).toHaveCount(0);

      await expect(adminQuestionFixture.getAnswerCounter()).toHaveText("Réponses: 0/1");

      await accueilliQuestionFixture.getAnswerByName("The Wall").click();

      await expect(adminMultiplayerInGameListFixture.getProfiles()).toHaveCount(1);

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" The Wall - 100% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" Dark Side of the Moon - 0% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" Animals - 0% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerMultiplayerByName(" Wish You Were Here - 0% ")).toBeVisible();

      await expect(adminQuestionFixture.getAnswerCounter()).toHaveText("Réponses: 1/1");

      await expect(pageAccueilli).toHaveURL(testUrl +"/answer-submitted")

      await expect(answerSubmittedFixture.getAnswerSavedMessage()).not.toBeVisible()

      await expect(answerSubmittedFixture.getAnswerResultMessage()).toBeVisible()

      await expect(answerSubmittedFixture.getAnswerResultMessage()).toHaveText("Dommage, bien essayé !")

    })

    await test.step('Admin - Fin de quiz', async () => {

      // On passe les 2 prochaines questions pour arriver à la fin du quiz

      await adminQuestionFixture.getNextQuestionBtn().click();

      await expect(pageAccueilli).toHaveURL(testUrl +"/multiplayer-game");

      await expect(pageAdmin).toHaveURL(testUrl +"/multiplayer-game");

      await adminQuestionFixture.getNextQuestionBtn().click();

      await expect(pageAccueilli).toHaveURL(testUrl +"/quiz-multiplayer-scoreboard");

      await expect(accueilliScoreboardFixture.getCongratsMessage()).toBeVisible()

      await expect(pageAdmin).toHaveURL(testUrl +"/quiz-multiplayer-scoreboard");

      await expect(adminScoreboardFixture.getCongratsMessage()).toBeVisible()

      await expect(adminScoreboardFixture.getQuestionList()).toHaveCount(3);

      await expect(adminScoreboardFixture.getToggleRankBtn()).toBeVisible();

      await adminScoreboardFixture.getToggleRankBtn().click();

      await expect(adminScoreboardFixture.getRank()).toBeVisible();

      await adminScoreboardFixture.getToggleRankBtn().click();

      await expect(adminScoreboardFixture.getRank()).not.toBeVisible();

      await expect(adminScoreboardFixture.getCongratsMessage()).toBeVisible()

      await adminScoreboardFixture.getQuestionByName("Quel groupe a sorti 'Bohemian Rhapsody' en 1975 ?").click();

      await expect(adminScoreboardFixture.getRank()).not.toBeVisible();

    })

    await test.step('Admin - Quitte la session', async () => {

      await adminScoreboardFixture.getLeaveBtn().click()

      await expect(pageAdmin).toHaveURL(testUrl +"/admin")

      await expect(pageAccueilli).toHaveURL(testUrl +"/multiplayer-game-login")

    })

  });



});


