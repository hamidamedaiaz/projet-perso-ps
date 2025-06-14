import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from 'src/services/quiz.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { GamemodeService } from 'src/services/gamemode.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-quiz-question-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-question-header.component.html',
  styleUrl: './quiz-question-header.component.scss'
})

export class QuizQuestionHeaderComponent {

  @Input()
  title!: string;

  @Input()
  font_size!: number;

  @Output()
  show_hints: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  private areHintsActives: Boolean = false;

  private DISPLAY_HINTS: string = "Afficher les indices";

  private HIDE_HINTS: string = "Masquer les indices";

  public showHintButtonContent: string = this.DISPLAY_HINTS

  constructor(private curretProfileService: CurrentProfileService,
    private gamemodeService: GamemodeService,
    private sessionService: SessionService,
    private quizService: QuizService) {
    this.quizService.question$.subscribe(() => {
      this.showHintButtonContent = this.DISPLAY_HINTS
      this.areHintsActives = false;
    })
  }

  getRole(): string {
    return this.curretProfileService.getCurrentProfile().role;
  }

  getNumberOfGivenAnswer(): number {
    return this.sessionService.getNumberOfGivenAnswers();
  }

  getNumberOfPlayers(): number {
    return this.sessionService.getNumberOfPlayers();
  }

  showHints(): void {
    this.show_hints.emit(true);
    this.areHintsActives = !this.areHintsActives;
    if (this.areHintsActives) this.showHintButtonContent = this.HIDE_HINTS;
    else this.showHintButtonContent = this.DISPLAY_HINTS;
  }

  public getGamemode() {
    return this.gamemodeService.getCurrentGamemode().name;
  }

  public isQuizRunning() {
    return this.quizService.isQuizRunning;
  }

}
