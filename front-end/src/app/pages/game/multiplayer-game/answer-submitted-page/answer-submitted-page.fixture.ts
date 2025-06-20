import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class AnswerSubmittedPageFixture extends E2EComponentFixture {

    getAnswerSavedMessage() { return this.page.locator('.answer-saved'); }

    getAnswerResultMessage() { return this.page.locator('.answer-result'); }

}