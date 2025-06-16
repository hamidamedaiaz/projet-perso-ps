import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class PopUpCodeFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('xpath=/html/body/app-root/app-home/section/app-popup-code/div/div/div/h2'); }

    getFirstInput() { return this.page.locator('xpath=/html/body/app-root/app-home/section/app-popup-code/div/div/div/div/input[1]') }

    getSecondInput() { return this.page.locator('xpath=/html/body/app-root/app-home/section/app-popup-code/div/div/div/div/input[2]') }

    getThirdInput() { return this.page.locator('xpath=/html/body/app-root/app-home/section/app-popup-code/div/div/div/div/input[3]') }

    getFourthInput() { return this.page.locator('xpath=/html/body/app-root/app-home/section/app-popup-code/div/div/div/div/input[4]')}

}