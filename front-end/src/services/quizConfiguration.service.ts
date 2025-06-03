import { Injectable } from "@angular/core";
import { Question } from "src/models/question.model";
import { Quiz } from "src/models/quiz.model";
import { EMPTY_QUIZ } from "src/mocks/quiz.mock";
import { CurrentProfileService } from "./currentProfile.service";
import { GUEST_PROFILE } from "src/mocks/profile-list.mock";
import { Profile } from "src/models/profile.model";

@Injectable({
    providedIn: 'root'
})
export class QuizConfigurationService {
    private profile: Profile = GUEST_PROFILE

    constructor(private currentProfileService: CurrentProfileService) {
        this.currentProfileService.current_profile$.subscribe((profile) => {
            this.profile = profile;
        });
    }

    public applyProfileConfiguration(quiz: Quiz): Quiz {
        // Créer une copie profonde du quiz pour ne pas modifier l'original
        const configuredQuiz = JSON.parse(JSON.stringify(quiz));

        // Vérifier si l'utilisateur est un administrateur
        const isAdmin = this.currentProfileService.getCurrentProfile().role === 'admin';

        // Si c'est un administrateur, ne pas appliquer les configurations de réduction
        if (isAdmin) return configuredQuiz;

        // Sinon, appliquer les configurations selon le profil utilisateur
        for (let i = 0; i < configuredQuiz.questions.length; i++) {
            // Apply Number Of Answer Displayed
            configuredQuiz.questions[i] = this.applyNumberOfDisplayedAnswersConfiguration(configuredQuiz.questions[i]);
            // Apply Number of Hints Displayed
            configuredQuiz.questions[i] = this.applyNumberOfDisplayedHintsConfiguration(configuredQuiz.questions[i]);
        }

        return configuredQuiz;
    }

    public applyNumberOfDisplayedAnswersConfiguration(question: Question): Question {

        const originalAnswers = [...question.answers];
        const answers = originalAnswers.filter((answer) => answer.isCorrect);

        const numberOfAnswersToDisplay = Math.min(this.profile.NUMBER_OF_ANSWERS_DISPLAYED - 1, (originalAnswers.length - answers.length));

        while (answers.length != numberOfAnswersToDisplay) {
            const random_answer_index = Math.floor(Math.random() * originalAnswers.length);
            if (originalAnswers[random_answer_index].isCorrect) continue;
            answers.push(originalAnswers[random_answer_index]);
            originalAnswers.splice(random_answer_index, 1);
        }

        question.answers = answers;
        return question;
    }

    public applyNumberOfDisplayedHintsConfiguration(question: Question): Question {
        const hints: string[] = [];
        const originalHints = [...question.hints];

        const numberOfHintsToDisplay = Math.min(this.profile.NUMBER_OF_HINTS_DISPLAYED, originalHints.length);
        for (let i = 0; i < numberOfHintsToDisplay; i++) {

            const random_hint_index = Math.floor(Math.random() * originalHints.length);
            hints.push(originalHints[random_hint_index]);
            originalHints.splice(random_hint_index, 1);
        }

        question.hints = hints;
        return question;
    }
}