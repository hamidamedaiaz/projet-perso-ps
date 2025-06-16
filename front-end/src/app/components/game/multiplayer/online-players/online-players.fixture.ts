import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class OnlinePlayersFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.online-players'); }

    getPlayers() { return this.page.locator('.player-card'); }

}