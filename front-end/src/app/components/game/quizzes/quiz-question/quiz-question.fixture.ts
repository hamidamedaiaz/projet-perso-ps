import { E2EComponentFixture } from "e2e/e2e-component.fixture";
import { QuizQuestionHeaderFixture } from "../quiz-question-header/quiz-question-header.fixture";
import { QuizHintsFixture } from "../quiz-hints/quiz-hints.fixture";
import { MusicControlFixture } from "../music-control/music-control.fixture";
import { QuizAnswersFixture } from "../quiz-answers/quiz-answers.fixture";

export class QuizQuestionFixture extends E2EComponentFixture {

    private quizQuestionHeaderFixture: QuizQuestionHeaderFixture = new QuizQuestionHeaderFixture(this.page);
    private quizHintsFixture: QuizHintsFixture = new QuizHintsFixture(this.page);
    private quizAnswersFixture: QuizAnswersFixture = new QuizAnswersFixture(this.page);
    private musicControlFixture: MusicControlFixture = new MusicControlFixture(this.page);

    getQuestion() { }



    getAnswers() { return this.quizAnswersFixture.getAnswers() }

    getAnswerByName(name: string) { return this.getAnswers().filter({ hasText: name }) }

    getAnswerMultiplayer() { return this.quizAnswersFixture.getQuizAnswerMultiplayer(); }

    getAnswerMultiplayerByName(name: string) { return this.getAnswerMultiplayer().filter({ hasText: name }); }

    getHints() { return this.quizHintsFixture.getHints(); }

    getHintsById(index: number) { return this.getHints().nth(index); }

    getHintByName(name: string) { return this.getHints().filter({ hasText: name }); }

    getNextQuestionBtn() { return this.page.locator('.next-question-btn')}

    getToogleHintsBtn() { return this.quizQuestionHeaderFixture.getToogleHintsBtn()}

    getAnswerCounter() { return this.quizQuestionHeaderFixture.getAnswerCounter()}



}
