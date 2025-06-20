import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class OnlinePlayersFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.online-players'); }

    getPlayers() { return this.page.locator('xpath=/html/body/app-root/app-multiplayer-game-setup/div/section/div/div[2]/app-online-players/div/ul/li'); }

    getPlayerByName(name: string) { return this.getPlayers().filter({ hasText: name }) }

    getMovePlayerBtnByName(name: string) { return this.getPlayerByName(name).locator(".add-button") }

}