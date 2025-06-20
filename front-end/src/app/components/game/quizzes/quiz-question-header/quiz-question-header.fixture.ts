import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class QuizQuestionHeaderFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.question-title'); }

    getAnswerCounter() { return this.page.locator('.answer-counter'); }

    getToogleHintsBtn() { return this.page.locator('#toggle-hints-btn'); }

}
