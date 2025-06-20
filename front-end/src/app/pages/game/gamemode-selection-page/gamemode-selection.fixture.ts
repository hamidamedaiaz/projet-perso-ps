import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class GamemodeSelectionFixture extends E2EComponentFixture{

  getSingleplayerButton(){
    //return this.page.locator(".solo");
    return this.page.locator("xpath=/html/body/app-root/app-gamemode-selection-page/app-gamemode-list/div/div[1]/app-gamemode/section/div");
  }

  getMultiplayerButton(){
    return this.page.locator(".multiplayer");
  }
}

