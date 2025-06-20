import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class ProfileConfigurationFixture extends E2EComponentFixture {

  getInputLabels() { return this.page.locator('.input-label') }

  // getUserFirstNameInput() { return this.getInputLabels().filter('Prénom').locator('.profile-input') }
  getUserFirstNameInput() { return this.page.locator('.input-label', { hasText: 'Prénom' }).locator('..').locator('.profile-input') }

  getUserLastNameInput() { return this.page.locator('.input-label', { hasText: /^Nom :$/ }).locator('..').locator('.profile-input') }

  getHintTimerSelector() { return this.page.locator('#show-hint-timer-selector') }

  getRelaunchTimerSelector() { return this.page.locator('#relaunch-timer-selector') }

  getRemoveAnswerTimerSelector() { return this.page.locator('#remove-answer-timer-selector') }

  getHintCountSelector() { return this.page.locator('#hint-count-selector') }

  getAnswerCountSelector() { return this.page.locator('#answer-count-selector') }

  getFontSizeSelector() { return this.page.locator('#font-size-selector') }

  getSaveBtn() { return this.page.locator('.save-button') }

  getCancelBtn() { return this.page.locator('.cancel-button') }

}
