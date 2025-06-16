import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { AdminPageFixture } from 'src/app/pages/admin/admin-page/admin-page.fixtures';
import { HomeFixture } from 'src/app/pages/home/home.fixture';
import { PopUpCodeFixture } from 'src/app/popup-code/popup-code.fixture';
import { QuizAppFixture } from 'src/app/components/admin/admin_quizzes/quiz-app/quiz-app.fixture';


  test.describe('Création d\'un Quiz', () => {
  
  test('Scénario complet de création d\'un quiz', async ({ page }) => {



    const homePageFixture = new HomeFixture(page);

    const popUpCodeFixture = new PopUpCodeFixture(page);

    const adminPageFixture = new AdminPageFixture(page);

    const quizAppFixture = new QuizAppFixture(page);



    await page.goto(testUrl)

    await test.step("Click on 'Espace Intervenant'", async () => {
      await homePageFixture.getAdminBtn().click();

      expect(popUpCodeFixture.getTitle()).toBeVisible();

      await popUpCodeFixture.getFirstInput().fill("1");
      await popUpCodeFixture.getSecondInput().fill("2");
      await popUpCodeFixture.getThirdInput().fill("3");
      await popUpCodeFixture.getFourthInput().fill("4");
      await page.waitForURL('**/admin');
    await expect(adminPageFixture.getTitle()).toBeVisible();
 });

 await test.step('Naviguer vers la section Quiz', async () => {
      await adminPageFixture.getSideBarQuizBtn().click();
      
      await expect(page.locator('app-quiz-app')).toBeVisible();
      
     await expect(quizAppFixture.getCreateQuizBtn()).toContainText('+ Créer un quiz');

    });

    await test.step('Initialiser la création du quiz', async () => {
      await quizAppFixture.getCreateQuizBtn().click();
      
      await expect(page.locator('app-quiz-details')).toBeVisible();
      await expect(page.locator('.title-quiz-template')).toContainText('Titre :');
    });
    await test.step('Définir le titre du quiz', async () => {

      await page.locator('#quiz-title .question-input').fill('Driss ');
      
      await expect(page.locator('#quiz-title .question-input')).toHaveValue('Driss');
    });

    

})
});
