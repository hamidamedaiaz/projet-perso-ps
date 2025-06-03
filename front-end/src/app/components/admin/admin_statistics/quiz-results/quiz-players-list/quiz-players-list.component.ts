import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionResult } from 'src/models/question-result.model';
import { Answer } from 'src/models/answer.model';
import { Quiz } from 'src/models/quiz.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';
import { ProfileService } from 'src/services/profile.service';
import { Profile } from 'src/models/profile.model';

@Component({
  selector: 'app-quiz-players-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-players-list.component.html',
  styleUrl: './quiz-players-list.component.scss'
})
export class QuizPlayersListComponent {

  @Input() profileList:Profile[] = [];



  getProfileList(){
    return this.profileList;
  }


}
