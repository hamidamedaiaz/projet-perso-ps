import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from 'src/models/profile.model';

@Component({
  selector: 'app-quiz-players-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-players-list.component.html',
  styleUrl: './quiz-players-list.component.scss'
})
export class QuizPlayersListComponent {

  @Input() profileList: Profile[] = [];

  getProfileList() { return this.profileList; }

}
