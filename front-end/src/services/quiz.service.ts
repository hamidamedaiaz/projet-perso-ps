import { Injectable } from "@angular/core";
import { Question } from "src/models/question.model";
import { Quiz } from "src/models/quiz.model";
import { LocalStorageService } from "./localstorage.service";
import { Answer } from "src/models/answer.model";
import { BehaviorSubject, count, find, findIndex } from "rxjs";
import { EMPTY_QUESTION } from "src/mocks/question.mock"
import { Router } from "@angular/router";
import { GamemodeService } from "./gamemode.service";
import { EMPTY_QUIZ } from "src/mocks/quiz.mock";
import { QuizConfigurationService } from "./quizConfiguration.service";
import { RecordResultService } from "./record-result.service";
import { QuizResultService } from "./quiz-result.service";
import { SocketService } from "./socket.service";
import { CurrentProfileService } from "./currentProfile.service";

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  public quiz: Quiz = EMPTY_QUIZ;

  public question: Question | undefined;

  public questionId: number = 0;

  private givenCorrectAnswers: Answer[] = [];

  public isQuizRunning = false;

  private readonly QUIZ_KEY = 'current_quiz';
  private readonly GIVEN_ANSWERS_KEY = 'current_score';
  private readonly QUESTION_ID_KEY = '0';
  private readonly IS_QUIZ_RUNNING_KEY = "is_quiz_running"


  public question$: BehaviorSubject<Question> = new BehaviorSubject<Question>(EMPTY_QUESTION);
  public quiz$: BehaviorSubject<Quiz> = new BehaviorSubject<Quiz>(EMPTY_QUIZ);
  public retrieveData$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor(private localStorageService: LocalStorageService,
    private router: Router,
    private gamemodeService: GamemodeService,
    private quizConfigurationService: QuizConfigurationService,
    private recordResultService: RecordResultService,
    private quizResultService: QuizResultService,
    private socketService: SocketService,
    private currentProfileService: CurrentProfileService) {

    this.loadFromStorage();

    this.question = this.quiz.questions?.[this.questionId];

    if (this.question) this.question$.next(this.question);
  }


  private loadFromStorage(): void {
    const savedQuiz = this.localStorageService.getItem(this.QUIZ_KEY);
    const savedGivenAnswers = this.localStorageService.getItem(this.GIVEN_ANSWERS_KEY);
    const savedQuestionId = this.localStorageService.getItem(this.QUESTION_ID_KEY);
    const savedIsQuizRunning = this.localStorageService.getItem(this.IS_QUIZ_RUNNING_KEY)

    if (savedQuiz) {
      this.quiz = savedQuiz;
      this.quiz$.next(savedQuiz);
    }

    if (savedGivenAnswers !== null) this.givenCorrectAnswers = savedGivenAnswers;

    if (savedQuestionId) this.questionId = savedQuestionId;

    if (savedIsQuizRunning) this.isQuizRunning = savedIsQuizRunning;
  }

  public increaseScore(answer: Answer) {
    if (!this.givenCorrectAnswers.includes(answer)) {
      this.givenCorrectAnswers.push(answer);
      this.localStorageService.removeItem(this.GIVEN_ANSWERS_KEY);
      this.localStorageService.storeItem(this.GIVEN_ANSWERS_KEY, JSON.stringify(this.givenCorrectAnswers));
    }
  }

  public getQuizId(): number { return this.quiz.id; }

  public setQuiz(quiz: Quiz) {
    if (!quiz || !quiz.questions) {
      console.error('Error - Invalid Quiz');
      return;
    }

    this.quiz = quiz;

    if (this.questionId >= 0 && this.questionId < this.quiz.questions.length) {
      this.question = this.quiz.questions[this.questionId];
    } else {
      this.questionId = 0;
      this.question = this.quiz.questions[0];
    }

    this.recordResultService.setQuiz(this.quiz);

    // CHANGE OBSERVABLE VALUES
    this.question$.next(this.question);
    this.quiz$.next(quiz);

    // STORE DATA
    this.localStorageService.removeItem(this.IS_QUIZ_RUNNING_KEY);
    this.localStorageService.removeItem(this.QUIZ_KEY);

    this.localStorageService.storeItem(this.IS_QUIZ_RUNNING_KEY, JSON.stringify(this.isQuizRunning));
    this.localStorageService.storeItem(this.QUIZ_KEY, JSON.stringify(quiz));
  }

  public setQuestion(questionId: number): void {
    // Vérifier que this.quiz existe et a des questions
    if (this.quiz.questions && this.quiz.questions.length > 0) {
      const matchingQuestion = this.quiz.questions.find(q => q.id === questionId);
      if (matchingQuestion) {
        this.question = matchingQuestion;
        this.question$.next(this.question);
      }
    }
  }

  public getScore(): number {
    let questionIdSeen:number[] = [];
    let score:number = 0;
    this.givenCorrectAnswers.forEach((answer) => {
      if(!questionIdSeen.includes(answer.questionId)) {
        score++;
        questionIdSeen.push(answer.questionId);
      }
    })
    return score;
  }

  public getQuestions(): Question[] {
    return this.quiz.questions;
  }

  public getNumberOfQuestions() {
    if (this.quiz && this.quiz.questions) return this.quiz.questions.length;
    return null;
  }

  public resetCurrentQuiz(): void {
    this.givenCorrectAnswers = [];
    this.questionId = 0;
    this.localStorageService.removeItem(this.QUIZ_KEY);
    this.localStorageService.removeItem(this.GIVEN_ANSWERS_KEY);
    this.isQuizRunning = false;
  }

  public nextQuestion() {
    if (this.isQuizRunning) {
      // Vérifier que this.quiz et this.quiz.questions existent
      if (!this.quiz || !this.quiz.questions) {
        console.error('Quiz ou questions non définis');
        this.resetCurrentQuiz();
        this.router.navigate(['/']);
        return;
      }

      // Call all component to retrieve the data
      this.retrieveData$.next(true);

      // Check if the quiz is finished
      if (this.questionId >= this.quiz.questions.length - 1) {

        this.isQuizRunning = false; // If the quiz is done, then we stop the quiz

        this.localStorageService.storeItem(this.IS_QUIZ_RUNNING_KEY, JSON.stringify(this.isQuizRunning));

        // Alert the server that we are available for a new game

        this.socketService.emit("lobby-connection", this.currentProfileService.getCurrentProfile());

        // Check the current gamemode to adapt the behavior
        if (this.gamemodeService.getCurrentGamemode().id === 0) {

          // If the current gamemode is 'Seul' then stop the record and send the data to the server
          this.recordResultService.stopRecording();
          this.quizResultService.sendQuizResult(this.recordResultService.getQuizResult())

          // Then navigate to the scoreboard

          this.router.navigate(["/quiz-scoreboard"]);

        } else if (this.gamemodeService.getCurrentGamemode().id === 1) {

          this.recordResultService.stopRecording();
          this.quizResultService.sendQuizResult(this.recordResultService.getQuizResult())

          this.router.navigate(['/quiz-multiplayer-scoreboard']);

        } else {
          this.router.navigate(['/']);
        }
      } else if (this.questionId < this.quiz.questions.length - 1) {
        // If the quiz is still runinng, then we change the current question and all params that belongs to her
        this.questionId++;
        this.question = this.quiz.questions[this.questionId];
        this.question$.next(this.question);
        if (this.gamemodeService.getCurrentGamemode().id === 1) {
          this.router.navigate(['/multiplayer-game'])
        }
      }
    } else {
      this.resetCurrentQuiz();
      console.log("An Error Occurred");
      this.router.navigate(['/']);
    }
  }

  public startQuiz() {

    if (!this.quiz) {
      console.error('Impossible de démarrer: quiz non défini');
      this.router.navigate(['/']);
      return;
    }

    this.resetCurrentQuiz();

    this.recordResultService.startRecording()

    this.socketService.emit("lobby-disconnect", this.currentProfileService.getCurrentProfile());

    this.quiz = this.quizConfigurationService.applyProfileConfiguration(this.quiz);

    if (!this.quiz.questions || this.quiz.questions.length === 0) {
      console.error('Le quiz ne contient pas de questions après configuration');
      this.router.navigate(['/']);
      return;
    }

    this.isQuizRunning = true;

    this.question = this.quiz.questions[this.questionId];
    this.question$.next(this.question);

    this.localStorageService.storeItem(this.IS_QUIZ_RUNNING_KEY, JSON.stringify(this.isQuizRunning));
    this.localStorageService.storeItem(this.QUIZ_KEY, JSON.stringify(this.quiz));
  }

  public previousQuestion() {
    if (!this.quiz || !this.quiz.questions) {
      console.error('Quiz ou questions non définis');
      return;
    }

    if (this.questionId > 0) {
      this.questionId--;
      this.question = this.quiz.questions[this.questionId];
      if (this.question) this.question$.next(this.question);
    }
  }


}
