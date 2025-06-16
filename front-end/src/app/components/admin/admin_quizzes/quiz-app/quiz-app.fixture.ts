import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class QuizAppFixture extends E2EComponentFixture {

    getQuizList() { return this.page.locator('.quiz-item') }

    getQuizByName(name: string) { return this.getQuizList().filter({ hasText: name }); }

    getLaunchMultiBtnByName(name: string) { return this.getQuizByName(name).locator('.launch-game-btn') }

    getEditQuizBtn(name: string) { return this.getQuizByName(name).locator('.edit-btn') }

    getDeleteQuizBtn(name: string) { return this.getQuizByName(name).locator('.delete-btn') }

    getCreateQuizBtn() { return this.page.locator('.create-quiz-btn') }

}