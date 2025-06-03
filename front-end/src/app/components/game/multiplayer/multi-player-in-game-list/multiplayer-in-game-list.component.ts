import { Component } from '@angular/core';
import { Player } from 'src/models/player.model';
import { Profile } from 'src/models/profile.model';
import { MultiPlayerQuizService } from 'src/services/multiplayer-quiz.service';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-multiplayer-in-game-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiplayer-in-game-list.component.html',
  styleUrl: './multiplayer-in-game-list.component.scss'
})
export class MultiPlayerInGameListComponent {

  private players: Player[] = [];

  constructor(private sessionService: SessionService) {
    this.sessionService.players$.subscribe((players) => {
      this.players = players;
    })
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  getInitials(profile: Profile): string {
    if (!profile) return '';

    const firstName = profile.name.charAt(0).toUpperCase();
    const lastName = profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }


}
