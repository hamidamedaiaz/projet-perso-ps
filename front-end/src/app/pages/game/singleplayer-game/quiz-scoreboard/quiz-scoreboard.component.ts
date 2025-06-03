import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { QuizService } from 'src/services/quiz.service';

@Component({
  selector: 'app-quiz-scoreboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-scoreboard.component.html',
  styleUrl: './quiz-scoreboard.component.scss'
})
export class QuizScoreboardComponent implements OnInit {

  public score: number;
  public maxPoint: number | null;

  public fontSize:string= '';

  constructor(
    private router: Router,
    private QuizService: QuizService, private currentProfileService:CurrentProfileService) {
    this.score = this.QuizService.getScore();
    this.maxPoint = this.QuizService.getNumberOfQuestions();
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

    // :)

    // @ts-ignore
    const confetti = window.confetti;
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 1000,
        spread: 180,
        origin: { y:0.4}
      });

      setTimeout(() => {
        confetti({
          particleCount: 1000,
          spread: 100,
          origin: { y:0.5 }
        });
      }, 700);
    }
  }

  public replay() {
    console.log("replay");
    this.QuizService.resetCurrentQuiz();
    this.router.navigate(["/select-quiz"]);
  }

  public exit() {
    console.log("exiting the quiz...");
    this.QuizService.resetCurrentQuiz();
    this.currentProfileService.resetCurrentProfile();
    this.router.navigate(["/"]);
  }

}
