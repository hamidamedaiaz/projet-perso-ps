import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { HomeFixture } from "../../src/app/pages/home/home.fixture";
import { GamemodeSelectionFixture } from "../../src/app/pages/game/gamemode-selection-page/gamemode-selection.fixture"
import { SelectQuizFixture } from "../../src/app/pages/game/select-quiz-page/select-quiz.fixture";
import { SingleplayerGameFixture} from "../../src/app/pages/game/singleplayer-game/singleplayer-game-page/singleplayer-game.fixture";
import {SoloTutorialFixture} from "../../src/app/pages/game/solo-tutorial/solo-tutorial.fixture";


test.setTimeout(60000);

test.describe("Jeu d'une partie solo", () => {

  test("Start a quiz", async ({ page }) => {

    await page.goto(testUrl);

    const homeFixture = new HomeFixture(page);
    const gamemodeSelectionFixture = new GamemodeSelectionFixture(page);
    const selectQuizFixture = new SelectQuizFixture(page);
    const singleplayerFixture = new SingleplayerGameFixture(page);
    const tutorielFixture = new SoloTutorialFixture(page);

    await expect(page).toHaveURL(testUrl);

    await test.step("Selection profile", async () => {
      const card = homeFixture.getCardByName("Jean Dupont");
      const count = await card.count();
      console.log(`Nombre de cartes Jean Dupont trouvé : ${count}`);
      await card.click();
      await expect(page).toHaveURL(testUrl + "/gamemode-selection");
    });

    await test.step("Selection mode de jeu", async () => {
      const singleplayerBtn = gamemodeSelectionFixture.getSingleplayerButton();
      await singleplayerBtn.click({force: true});
      await expect(page).toHaveURL(testUrl + "/select-quiz");
    })

    await test.step("Lancement du tutoriel", async () => {
      const tutoBtn = singleplayerFixture.getTutorialButton();
      await tutoBtn.click();
      await expect(page).toHaveURL(testUrl + "/tutorial")
    })

    await test.step("Skip tutoriel", async () => {
      const skipBtn = tutorielFixture.getSkipBtn();
      skipBtn.click();
      await expect(page).toHaveURL(testUrl + "/select-quiz");
    })

    await test.step("Lancement du tutoriel après skip", async () => {
      const tutoBtn = singleplayerFixture.getTutorialButton();
      await tutoBtn.click();
      await expect(page).toHaveURL(testUrl + "/tutorial")
    })


    await test.step("Defilement des conseils du tuto", async () => {
      let count = await tutorielFixture.getElemThatContains("1.Sélectionner un quiz").count()
      expect(count).toBe(1);
      const nextBtn = tutorielFixture.getNextBtn()
      await nextBtn.click();


      count = await tutorielFixture.getElemThatContains("ImpossibleStringThatWillNeverBeHereCordialement").count()
      expect(count).toBe(0);
      count = await tutorielFixture.getElemThatContains("2.Lancer le quiz").count()
      expect(count).toBe(1);
      await nextBtn.click();

      count = await tutorielFixture.getElemThatContains("3.Contrôles audio").count()
      expect(count).toBe(1);
      await nextBtn.click();

      count = await tutorielFixture.getElemThatContains("4.Afficher les indices").count()
      expect(count).toBe(1);
      await nextBtn.click();

      count = await tutorielFixture.getElemThatContains("5.Résultat final").count()
      expect(count).toBe(1);

      const startButton = tutorielFixture.getStartButton();
      startButton.click();

      await expect(page).toHaveURL(testUrl + "/select-quiz");
    })


    await test.step("Selection Quiz", async () => {
      await selectQuizFixture.clickOnStartQuizByName("Quiz Rock des années 70-80");
      await expect(page).toHaveURL(testUrl+ "/singleplayer-game");
      const count = await singleplayerFixture.getHiddenAnswer().count();
      expect(count).toBe(0);
    })


    await test.step("Attente Indice", async () => {
      await expect(
        singleplayerFixture.getHintByName("Le leader du groupe était Freddie Mercury")
      ).toBeVisible({ timeout: 10000 });
    });

    await test.step("Attente remove reponse", async () => {
      await expect(singleplayerFixture.getHiddenAnswer()).toHaveCount(1, { timeout: 10000 });
    });

    await test.step("Attente popUp et refus", async () => {
      await expect(
        singleplayerFixture.getPopup()
      ).toBeVisible({ timeout: 10000 });
      await singleplayerFixture.getCancelgetCancelButtonPopUp().click();
      await expect(singleplayerFixture.getPopup()).not.toBeVisible();
    });


    await test.step("Jouer Musique", async () => {
      // 1. Démarre la lecture
      await singleplayerFixture.getPlayButton().click();

      // 2. Attendre activement que l'audio commence à jouer
      await expect.poll(async () => {
        return await page.evaluate(() => {
          const audio = document.querySelector('audio');
          return !!audio && !audio.paused && !audio.ended && audio.currentTime > 0;
        });
      }, {
        timeout: 10000,
        message: "L'audio n'a pas démarré dans les 10 s",
      }).toBe(true);

      // 3. Arrête la lecture
      await singleplayerFixture.getStopButton().click();

      // 4. Attendre activement que l'audio soit bien en pause
      await expect.poll(async () => {
        return await page.evaluate(() => {
          const audio = document.querySelector('audio');
          return !!audio && audio.paused && !audio.ended && audio.currentTime > 0;
        });
      }, {
        timeout: 5000,
        message: "L'audio ne s'est pas arrêté correctement",
      }).toBe(true);
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
      const goodAnswer = singleplayerFixture.getAvailableAnswer().filter({ hasText: "Queen" })
      await goodAnswer.click();

      const title = singleplayerFixture.getQuestion();
      await expect(title).toHaveText("Quel album des Pink Floyd est sorti en 1973 ?", { timeout: 10000 });

    })


    await test.step("Passe a la question suivante", async () => {

      const title = singleplayerFixture.getQuestion();
      await expect(title).toHaveText(" Quel album des Pink Floyd est sorti en 1973 ? ", { timeout : 10000})

      const skipButton = singleplayerFixture.getSkipButton();
      await skipButton.click()

    })


    await test.step("Repond correctement", async() => {
      const title = singleplayerFixture.getQuestion();
      await expect(title).toHaveText(" Qui a chanté 'Hotel California' en 1976 ?", {timeout: 10000})

      const goodAnswer = singleplayerFixture.getAvailableAnswer().filter({hasText: " The Eagles"})
      await goodAnswer.click()
    })
  });
});

