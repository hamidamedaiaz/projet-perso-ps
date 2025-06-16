import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class SingleplayerGameFixture extends E2EComponentFixture {

  getHiddenAnswer(){
    return this.page.locator(".hidden-answer");
  }

  getPlayButton(){
    return this.page.locator("#play-btn");
  }

  getStopButton(){
    return this.page.locator("#pause-btn");
  }

  getTitle(){
    return this.page.locator(".question-title user-view");
  }
  getAvailableAnswer() {
    return this.page.locator('div.answers-container:not(.selected-answer)');
  }

  async getAvailableAnswerExcept(name : string) {
    const allAnswers = this.page.locator('div.answers-container:not(.selected-answer)');
    const count = await allAnswers.count();
    const filteredAnswers = [];

    for (let i = 0; i < count; i++) {
      const element = allAnswers.nth(i);
      const text = await element.innerText();
      if (!text.trim().includes(name)) {
        filteredAnswers.push(element);
      }
    }

    return filteredAnswers;
  }


  getHintByName(name: string) {
    // On cible uniquement les <p> visibles contenant exactement le texte souhaité
    return this.page.locator('p.hint-item', { hasText: name });
  }

  getPopup(){
    return this.page.locator('.pop-up-container');
  }

  getCancelgetCancelButtonPopUp(){
    return this.page.locator(".cancel-btn");
  }
}
