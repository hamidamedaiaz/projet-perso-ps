import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class MultiplayerInGameListFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('.title'); }

    getProfiles() { return this.page.locator('.profile-card-container'); }


}