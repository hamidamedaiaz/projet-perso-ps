import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class MultiplayerGameLoginPageFixture extends E2EComponentFixture {

  getMessage() { return this.page.locator(".join-game-title"); }

  getCodeInput() { return this.page.locator(".join-game-code-input") }

  getJoinSessionBtn() { return this.page.locator(".join-game-submit") }

  getBackBtn() { return this.page.locator("#leave-btn") }

}
