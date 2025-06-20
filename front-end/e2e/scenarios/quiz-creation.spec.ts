import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { AdminPageFixture } from 'src/app/pages/admin/admin-page/admin-page.fixture';
import { HomeFixture } from 'src/app/pages/home/home.fixture';
import { PopUpCodeFixture } from 'src/app/popup-code/popup-code.fixture';
import { QuizAppFixture } from 'src/app/components/admin/admin_quizzes/quiz-app/quiz-app.fixture';
import { QuizDetailsFixture } from 'src/app/components/admin/admin_quizzes/quiz-details/quiz-details.fixture';

test.describe('Création de Quiz ', () => {
   test.describe.configure({ timeout: 200000 })

  test('Créer un quiz', async ({ page }) => {

    const homePageFixture = new HomeFixture(page);
    const popUpCodeFixture = new PopUpCodeFixture(page);
    const adminPageFixture = new AdminPageFixture(page);
    const quizAppFixture = new QuizAppFixture(page);
    const quizDetailsFixture = new QuizDetailsFixture(page);

    await page.goto(testUrl);

    await test.step("Accès administration", async () => {
      await homePageFixture.getAdminBtn().click();
      await expect(popUpCodeFixture.getTitle()).toBeVisible();

      await popUpCodeFixture.getFirstInput().fill("1");
      await popUpCodeFixture.getSecondInput().fill("2");
      await popUpCodeFixture.getThirdInput().fill("3");
      await popUpCodeFixture.getFourthInput().fill("4");

      await expect(page).toHaveURL(/\/admin$/);
    });

    await test.step("Navigation vers section Quiz", async () => {
      await adminPageFixture.getSideBarQuizBtn().click();
      await expect(page.locator('app-quiz-app')).toBeVisible();

      await quizAppFixture.getCreateQuizBtn().click();
      await expect(page.locator('app-quiz-details')).toBeVisible();

      await quizDetailsFixture.getTitleInput().fill("Quiz Chanson Française");
    });

    await test.step("Créer première question", async () => {
      console.log("Création première question...");

      await quizDetailsFixture.getAddQuestionBtn().click();

      await quizDetailsFixture.selectQuestionByIndex(1);

      await quizDetailsFixture.selectQuestionByIndex(0);
      await quizDetailsFixture.getWorkingQuestionInput().fill("Qui a chanté 'La Vie en Rose' ?");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(0).fill("Brigitte Bardot");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(1).fill("Édith Piaf");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(2).fill("Françoise Hardy");

      await quizDetailsFixture.getAnswerCheckbox(2).click();

      await quizDetailsFixture.getAddHintBtn().click();
      await quizDetailsFixture.getHintInput(0).fill("Surnommée 'La Môme'");

      await quizDetailsFixture.getSaveQuestionBtn().click();

    });

    await test.step("Créer deuxième question", async () => {
      console.log("Création deuxième question...");

      await quizDetailsFixture.getAddQuestionBtn().click();

      await quizDetailsFixture.selectQuestionByIndex(0);
      await quizDetailsFixture.getWorkingQuestionInput().fill("Quel chanteur français a popularisé 'Ne me quitte pas' ?");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(0).fill("Charles Aznavour");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(1).fill("Jacques Brel");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(2).fill("Georges Brassens");

      await quizDetailsFixture.getAnswerCheckbox(1).click();


      await quizDetailsFixture.getAddHintBtn().click();
      await quizDetailsFixture.getHintInput(0).fill("Il était belge mais a marqué la chanson française");

      await quizDetailsFixture.getSaveQuestionBtn().click();

    });


    await test.step("Créer première question", async () => {
      console.log("Création 3emme question...");

      await quizDetailsFixture.getAddQuestionBtn().click();

      await quizDetailsFixture.selectQuestionByIndex(1);

      await quizDetailsFixture.selectQuestionByIndex(0);
      await quizDetailsFixture.getWorkingQuestionInput().fill("Dans quelle ville a lieu le Festival des Vieilles Charrues ?");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(0).fill("Carhaix");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(1).fill("Rennes");

      await quizDetailsFixture.getAddAnswerBtn().click();
      await quizDetailsFixture.getAnswerInput(2).fill("Brest");

      await quizDetailsFixture.getAnswerCheckbox(1).click();

      await quizDetailsFixture.getAddHintBtn().click();
      await quizDetailsFixture.getHintInput(0).fill("C'est en Bretagne, dans le Finistère");

      await quizDetailsFixture.getSaveQuestionBtn().click();

    });


    await test.step("Sauvegarder le quiz complet", async () => {

      await quizDetailsFixture.getSaveQuizBtn().click();

      await expect(page.locator('app-quiz-app')).toBeVisible();

    });

    await test.step("Delete quiz", async () => {
      const btn = quizAppFixture.getDeleteQuizBtn("Quiz Chanson Française");
      await btn.click();
      const confirm = quizAppFixture.getConfirmBtn();
      await confirm.click();
      await expect(quizAppFixture.getQuizByName("Quiz Chanson Française")).not.toBeVisible()
    })
  });
});
