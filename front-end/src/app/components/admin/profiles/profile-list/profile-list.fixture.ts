import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class ProfileListFixture extends E2EComponentFixture {

  getAddUserBtn() { return this.page.locator('#add-profile') }

  getModalContainer() { return this.page.locator('.modal-container') }

  getModalFirstNameInput() { return this.page.locator('#firstName') }

  getModalLastNameInput() { return this.page.locator('#lastName') }

  getModalSaveBtn() { return this.page.locator('.save-btn') }

  getUserList() { return this.page.locator('.enhanced-profile-item') }

  getUserByName(name: string) { return this.getUserList().filter({ hasText: name }); }

  getConfigPanel() { return this.page.locator('.config-panel') }

  getDeleteBtnForUser(name: string) {
    return this.page
      .locator('.enhanced-profile-item', {
        has: this.page.locator('p.profile-name', { hasText: name }),
      })
      .locator('button.delete-btn')
  }

  getDeletePopUp() { return this.page.locator('.delete-confirm-content') }

  getConfirmDeleteBtn() { return this.page.locator('.confirm-delete-btn') }

}
