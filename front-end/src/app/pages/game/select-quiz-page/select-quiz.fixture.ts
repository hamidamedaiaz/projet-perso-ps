import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class SelectQuizFixture extends E2EComponentFixture{

  getAllQuiz(){
    return this.page.locator(".solo-selection-quiz-item");
  }

  getQuizByName(name: string) {
    return this.getAllQuiz().filter({
      hasText: name
    });
  }

  async clickOnStartQuizByName(name : string){
    await this.getQuizByName(name).click();
  }
}
