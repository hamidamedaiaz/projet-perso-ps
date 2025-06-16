import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class AppFixture extends E2EComponentFixture {

    getTitle() { return this.page.locator('/html/body/app-root/app-admin/html/body/div/main/div/span'); }

    getSideBarStatsBtn() { return this.page.locator('/html/body/app-root/app-admin/html/body/div/nav/button[1]') }

    getSideBarQuizBtn() { return this.page.locator('/html/body/app-root/app-admin/html/body/div/nav/button[2]') }

    getSideBarAccueilliBtn() { return this.page.locator('/html/body/app-root/app-admin/html/body/div/nav/button[3]') }

    getSideBarBackBtn() { return this.page.locator('/html/body/app-root/app-admin/html/body/div/nav/button[4]')}

}