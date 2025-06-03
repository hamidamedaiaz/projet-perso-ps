import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Answer } from 'src/models/answer.model';
import { CommonModule } from '@angular/common';
import { GamemodeService } from 'src/services/gamemode.service';
import { ProfileService } from 'src/services/profile.service';
import { Profile } from 'src/models/profile.model';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { GAMEMODE_UNDEFINED } from 'src/mocks/gamemode-list.mock';
import { Gamemode } from 'src/models/gamemode.model';
import { QuizService } from 'src/services/quiz.service';

@Component({
  selector: 'app-quiz-answer',
  standalone: true,
  imports: [QuizAnswerComponent, CommonModule],
  templateUrl: './quiz-answer.component.html',
  styleUrl: './quiz-answer.component.scss'
})
export class QuizAnswerComponent {

  public selected: boolean = false;

  @Input()
  answer!: Answer;


  @Input()
  percent?: any;

  @Output()
  @Output() answerSelected: EventEmitter<Answer> = new EventEmitter<Answer>();

  private profile: Profile | undefined;

  private gamemode: Gamemode = GAMEMODE_UNDEFINED;

  constructor(private gamemodeService: GamemodeService, private currentProfileService: CurrentProfileService) {
    this.currentProfileService.current_profile$.subscribe((profile) => {
      this.profile = profile;
    })
    this.selected = false;
  }

  public getGamemode() {
    this.gamemode = this.gamemodeService.getCurrentGamemode();
    return this.gamemode.name;
  }

  public getRole() {
    return this.profile?.role;
  }

  selectedAnswer() {
    if(this.answer.isCorrect) this.selected = true;
    this.answerSelected.emit(this.answer);
  }

  getPercent() {
    return this.percent;
  }
}