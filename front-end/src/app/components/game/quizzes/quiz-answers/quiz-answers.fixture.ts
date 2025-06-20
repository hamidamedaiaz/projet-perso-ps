import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class QuizAnswersFixture extends E2EComponentFixture {

    getNumberOfCorrectAnswer() { return this.page.locator(".number-of-correct-answer"); }

    getAnswers() { return this.page.locator('.answers-container'); }

    getQuizAnswerMultiplayer() { return this.page.locator('.answers-section-admin-view'); }

    getNumberOfGivenAnswers() { return this.page.locator('#multiplayer-answer'); }

}
