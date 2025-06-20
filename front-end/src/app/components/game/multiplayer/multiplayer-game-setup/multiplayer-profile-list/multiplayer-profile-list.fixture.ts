import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class MultiplayerProfileListFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.title'); }

    getPlayers() { return this.page.locator('xpath=/html/body/app-root/app-multiplayer-game-setup/div/section/div/div[1]/app-multiplayer-profile-list/section/section/div') }

    getPlayerByName(name: string) { return this.getPlayers().filter({ hasText: name }) }

    getKickBtnByName(name: string) { return this.getPlayerByName(name).locator('.kick-button') }

}