import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { HomeFixture } from "../../src/app/pages/home/home.fixture";
import { GamemodeSelectionFixture } from "../../src/app/pages/game/gamemode-selection-page/gamemode-selection.fixture"
import { SelectQuizFixture } from "../../src/app/pages/game/select-quiz-page/select-quiz.fixture";
import { SingleplayerGameFixture} from "../../src/app/pages/game/singleplayer-game/singleplayer-game-page/singleplayer-game.fixture";

test.describe("Jeu d'une partie solo", () => {

  test("Start a quiz", async ({ page }) => {

    await page.goto(testUrl);

    const homeFixture = new HomeFixture(page);
    const gamemodeSelectionFixture = new GamemodeSelectionFixture(page);
    const selectQuizFixture = new SelectQuizFixture(page);
    const singleplayerFixture = new SingleplayerGameFixture(page);

    await expect(page).toHaveURL("http://localhost:4200/");

    await test.step("Selection profile", async () => {
      const card = homeFixture.getCardByName("Jean Dupont");
      const count = await card.count();
      console.log(`Nombre de cartes Jean Dupont trouvé : ${count}`);
      await card.click();
      await expect(page).toHaveURL("http://localhost:4200/gamemode-selection");
    });

    await test.step("Selection mode de jeu", async () => {
      const singleplayerBtn = gamemodeSelectionFixture.getSingleplayerButton();
      await singleplayerBtn.click({force: true});
      await expect(page).toHaveURL("http://localhost:4200/select-quiz");
    })

    await test.step("Selection Quiz", async () => {
      await selectQuizFixture.clickOnStartQuizByName("Quiz Rock des années 70-80");
      await expect(page).toHaveURL("http://localhost:4200/singleplayer-game");
      const count = await singleplayerFixture.getHiddenAnswer().count();
      expect(count).toBe(0);
    })


    await test.step("Attente Indice", async () => {
      await expect(
        singleplayerFixture.getHintByName("Le leader du groupe était Freddie Mercury")
      ).toBeVisible({timeout: 10000});
    });

    await test.step("Attente remove reponse", async () => {
      await expect(singleplayerFixture.getHiddenAnswer()).toHaveCount(1, {timeout: 10000});
    });


    await test.step("Attente popUp et refus", async () => {
      await expect(
        singleplayerFixture.getPopup()
      ).toBeVisible({timeout: 10000});
      await singleplayerFixture.getCancelgetCancelButtonPopUp().click();
      await expect(singleplayerFixture.getPopup()).not.toBeVisible();
    });



    await test.step("Jouer Musique", async () => {

      await singleplayerFixture.getPlayButton().click();
      await page.waitForTimeout(1000);
      // Vérifie que la musique joue
      let isPlaying = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (!audio) return false;
        return !audio.paused && !audio.ended && audio.currentTime > 0;
      });
      expect(isPlaying).toBe(true);

      await singleplayerFixture.getStopButton().click();
      await page.waitForTimeout(1000);

      // Vérifie que la musique est bien en pause (arrêtée)
      let isPaused = await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (!audio) return false;
        return audio.paused && !audio.ended && audio.currentTime > 0;
      });
      expect(isPaused).toBe(true);



    });


    await test.step("Clique mauvaise reponse", async () => {
      const answers = await singleplayerFixture.getAvailableAnswerExcept("Queen");
      expect(answers.length).toBe(2);

      const badAnswer = answers[0];
      const badAnswerText = await badAnswer.innerText(); // Save text to reselect it later

      await badAnswer.click();

      const updatedAnswer = page.locator('div.answers-container', { hasText: badAnswerText });
      await expect(updatedAnswer).toHaveClass(/selected-answer/);
    });

    await test.step("Clique bonne reponse", async () => {
      const goodAnswer = singleplayerFixture.getAvailableAnswer().filter({hasText : "Queen"})
      await goodAnswer.click();

      const title = page.locator('.question-title'); // Fix selector if needed
      await expect(title).toHaveText("Quel album des Pink Floyd est sorti en 1973 ?", { timeout: 10000 });

    })




  });

});
