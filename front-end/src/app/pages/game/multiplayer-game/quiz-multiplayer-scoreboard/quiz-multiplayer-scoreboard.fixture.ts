import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class QuizMultiplayerScoreboardFixture extends E2EComponentFixture {

    getToggleRankBtn() { return this.page.locator('.rank-btn'); }

    getLeaveBtn() { return this.page.locator('.leave-btn'); }

    getCongratsMessage() { return this.page.locator('.congrats-message'); }

    getRank() { return this.page.locator('.ranking'); }

    getQuestionList() { return this.page.locator('.scoreboard-question-item'); }

    getQuestionByName(name: string) { return this.getQuestionList().filter({ hasText: name }) }

}