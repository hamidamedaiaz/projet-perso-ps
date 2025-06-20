import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class WaitingStartPageFixture extends E2EComponentFixture {

  getMessage() { return this.page.locator(".waiting-message"); }

  getCancelBtn() { return this.page.locator("#leave-btn") }

  getTutorialBtn() { return this.page.locator("#tuto-btn") }

}
