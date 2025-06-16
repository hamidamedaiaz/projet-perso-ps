import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class MultiplayerGameSetupSideBarFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.quiz-title') }

    getGameCode() { return this.page.locator('#game-code') }

    getStartGameBtn() { return this.page.locator('#launch-game-btn') }

    getBackBtn() { return this.page.locator('#back-btn') }

}