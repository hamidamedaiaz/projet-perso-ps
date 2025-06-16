import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class HomeFixture extends E2EComponentFixture {

  getCards() {
    return this.page.locator('.profile-card');
  }

  getCardByName(name: string) {
    return this.getCards().filter({
      hasText: name
    });
  }

  getAdminBtn() { return this.page.locator('xpath=/html/body/app-root/app-home/section/button') }
}
