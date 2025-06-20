import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class QuizDetailsFixture extends E2EComponentFixture {

    getTitleInput() { 
        return this.page.locator('.question-input').first();
    }

    // ===== GESTION DES QUESTIONS =====
    getAddQuestionBtn() { 
        return this.page.locator('#add-listQ'); 
    }

    getQuestionsList() { 
        return this.page.locator('.question-row'); 
    }

    getQuestionByIndex(index: number) { 
        return this.page.locator('.question-row').nth(index); 
    }
   getDeleteQuestionBtn(questionIndex: number) { 
        return this.page.locator('.question-row').nth(questionIndex).locator('.delete-btn');
    }

    selectQuestionByIndex(index: number) { 
        return this.page.locator('.sidebar-btn').nth(index); 
    }

    getSelectedQuestion() { 
        return this.page.locator('.sidebar-btn.selected'); 
    }
    async deleteQuestionByIndex(questionIndex: number) {
        await this.getDeleteQuestionBtn(questionIndex).click();
    }

    getQuestionInput() { 
        return this.page.locator('.question-input').nth(1); 
    }

    getQuestionTextInput() { 
        return this.page.locator('#question-section .question-input'); 
    }

    getWorkingQuestionInput() {
        // Après le double-clic, il faut utiliser le DEUXIÈME input qui marche
        return this.page.locator('#question-section .question-input').last();
    }

    getAddAnswerBtn() { 
        return this.page.locator('#add-answer'); 
    }

    getAnswers() { 
        return this.page.locator('app-answer'); 
    }

    getAnswerInput(index: number) { 
        return this.page.locator('app-answer').nth(index).locator('.answer-input'); 
    }

    getAnswerCheckbox(index: number) { 
        return this.page.locator('app-answer').nth(index).locator('.answer-checkbox'); 
    }

    getDeleteAnswerBtn(index: number) { 
        return this.page.locator('app-answer').nth(index).locator('.delete-btn'); 
    }

    // ===== GESTION DES INDICES =====
    getAddHintBtn() { 
        return this.page.locator('#add-hint'); 
    }

    getHints() { 
        return this.page.locator('.hint-item'); 
    }

    getHintInput(index: number) { 
        return this.page.locator('.hint-input').nth(index); 
    }

    getDeleteHintBtn(index: number) { 
        return this.page.locator('.hint-item').nth(index).locator('.delete-btn'); 
    }

    // ===== BOUTONS DE SAUVEGARDE =====
    getSaveQuestionBtn() { 
        return this.page.locator('.save-question-btn'); 
    }

    getCancelQuestionBtn() { 
        return this.page.locator('.cancel-btn').first(); 
    }

    getSaveQuizBtn() { 
        return this.page.locator('#end-quiz'); 
    }

}