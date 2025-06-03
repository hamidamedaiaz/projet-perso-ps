import { Component, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizHintComponent } from '../quiz-hint/quiz-hint.component';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { QuizService } from 'src/services/quiz.service';
import { GamemodeService } from 'src/services/gamemode.service';
import { Subscription, interval } from 'rxjs';
import { Question } from 'src/models/question.model';
import { RecordResultService } from 'src/services/record-result.service';

@Component({
  selector: 'app-quiz-hints',
  standalone: true,
  imports: [CommonModule, QuizHintComponent],
  templateUrl: './quiz-hints.component.html',
  styleUrl: './quiz-hints.component.scss'
})
export class QuizHintsComponent implements OnDestroy {
  private hints: string[] = []
  private displayedHints: string[] = [];
  public value: number = 10;
  private timerSubscription: Subscription | null = null;
  private currentHintIndex: number = 0;
  public nextHints: Boolean = false;

  private SHOW_HINT_TIMER: number = 5;

  constructor(private quizService: QuizService, private currentProfileService: CurrentProfileService, private recordResultService: RecordResultService) {
    this.currentProfileService.current_profile$.subscribe((profile) => {
      // On divise par 1000 pour passer de MS en S
      this.SHOW_HINT_TIMER = profile.SHOW_HINT_TIMER/1000;
    })

    this.quizService.retrieveData$.subscribe((data) => {
      if(data) this.recordResultService.setNumberOfHintsUsed(this.quizService.questionId, this.displayedHints.length);
    })

    this.quizService.question$.subscribe((question) => {
      this.resetHints(question);
      if (this.currentProfileService.getCurrentProfile().role === "admin") {
        this.displayedHints = [...this.hints];
      } else {
        this.nextHints = true;
        this.startTimer();
      }
    });
  }

  private resetHints(question: Question) {
    this.displayedHints = [];
    this.hints = question.hints;
    this.currentHintIndex = 0;
    this.stopTimer();
  }


  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {

    this.value = Math.floor(this.SHOW_HINT_TIMER);

    this.timerSubscription = interval(1000).subscribe(() => {
      this.value--;

      if (this.value <= 0 && this.currentHintIndex < this.hints.length) {

        this.displayedHints.push(this.hints[this.currentHintIndex]);
        this.currentHintIndex++;

        // If there are more hints, reset the timer
        if (this.currentHintIndex < this.hints.length) {
          this.value = this.SHOW_HINT_TIMER;
        } else {
          // No more hints, stop the timer
          this.stopTimer();
          this.nextHints = false;
        }
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  public getHints(): string[] {
    return this.hints;
  }

  public getDisplayedHints(): string[] {
    return this.displayedHints;
  }
}
