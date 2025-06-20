import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class QuizHintsFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator(".hint-title"); }

    getHints() { return this.page.locator('.hints-container'); }

    

}
