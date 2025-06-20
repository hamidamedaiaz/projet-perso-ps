import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class SoloTutorialFixture extends E2EComponentFixture {


  getSkipBtn(){
    return this.page.locator(".skip-button");
  }

  getNextBtn(){
    return this.page.locator(".nav-button").filter({hasText : "Suivant"});
  }

  getElemThatContains(text : string){
    return this.page.locator("h2").filter({hasText : text});
  }

  getStartButton(){
    return this.page.locator(".start-button")
  }

}
