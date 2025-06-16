import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class MultiplayerProfileListFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.title'); }

    getPlayers() { return this.page.locator('.player-card') }

    getPlayerByName(name: string) {
        return this.getPlayers().filter({ hasText: name })
    }

}