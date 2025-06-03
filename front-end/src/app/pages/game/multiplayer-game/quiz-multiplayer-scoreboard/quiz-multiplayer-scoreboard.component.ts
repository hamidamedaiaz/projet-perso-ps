import { Component } from '@angular/core';
import { MultiplayerProfileListComponent } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-profile-list/multiplayer-profile-list.component';
import { Quiz } from 'src/models/quiz.model';
import { QuizService } from 'src/services/quiz.service';
import { CommonModule } from '@angular/common';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { Router } from '@angular/router';
import { QuizQuestionComponent } from 'src/app/components/game/quizzes/quiz-question/quiz-question.component';
import { Question } from 'src/models/question.model';
import { SocketService } from 'src/services/socket.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-quiz-multiplayer-scoreboard',
  standalone: true,
  imports: [MultiplayerProfileListComponent, CommonModule, QuizQuestionComponent],
  templateUrl: './quiz-multiplayer-scoreboard.component.html',
  styleUrl: './quiz-multiplayer-scoreboard.component.scss'
})
export class QuizMultiplayerScoreboardComponent {


  private quiz: Quiz | null = null;

  private congrats_message: string = "Félicitation, vous avez terminé le quiz !"

  private displayedQuestion: Question | null = null;

  public displayQuestion: Boolean = false;

  constructor(private quizService: QuizService,
    private currentProfileService: CurrentProfileService,
    private router: Router,
    private socketService: SocketService,
    private sessionService: SessionService) {

    this.quizService.quiz$.subscribe((quiz) => {
      this.quiz = quiz;
    })

  }

  ngOnInit(): void {
    this.loadConfettiScript();
  }

  loadConfettiScript(): void {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    script.onload = () => {
      this.triggerConfetti();
    };
    document.body.appendChild(script);
  }

  triggerConfetti(): void {

    // :)  -------------------------------------------------------------------------------> Hamid le GOOOOAT

    // @ts-ignore
    const confetti = window.confetti;
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 1000,
        spread: 700000,
        origin: { y: 0.5 }
      });

      setTimeout(() => {
        confetti({
          particleCount: 1000,
          spread: 100,
          origin: { y: 0.6 }
        });
      }, 700);
    }
  }

  public getQuizTitle() {
    return this.quiz?.title;
  }

  public getQuizQuestions() {
    console.log(this.quiz?.questions);
    return this.quiz?.questions
  }

  public get_congrats_message() {
    return this.congrats_message;
  }

  public showQuestion(questionId: number) {
    this.displayQuestion = true;
    this.quizService.setQuestion(questionId);
  }

  public leaveMultiplayerQuiz() {
    this.sessionService.leaveMultiplayerQuiz();
    this.router.navigate(['/admin'])
  }

  public leaveQuiz() {
    this.quizService.resetCurrentQuiz()
    this.socketService.emit("leave-session",
      { profile: this.currentProfileService.getCurrentProfile(), sessionId: this.sessionService.getSessionId() })
    this.router.navigate(["/multiplayer-game-login"]);
  }

  public getRole() {
    return this.currentProfileService.getCurrentProfile().role
  }

}
