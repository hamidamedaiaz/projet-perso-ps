import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class AdminPageFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('xpath=/html/body/app-root/app-admin/div/main/div/span'); }

    getSideBarStatsBtn() { return this.page.locator('xpath=/html/body/app-root/app-admin/div/nav/button[1]/span') }

    getSideBarQuizBtn() { return this.page.locator('xpath=/html/body/app-root/app-admin/div/nav/button[2]') }

    getSideBarAccueilliBtn() { return this.page.locator('xpath=/html/body/app-root/app-admin/div/nav/button[3]') }

    getSideBarBackBtn() { return this.page.locator('xpath=/html/body/app-root/app-admin/div/nav/button[4]')}

}
