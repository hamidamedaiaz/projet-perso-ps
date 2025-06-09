import { Component } from '@angular/core';
import { Player } from 'src/models/player.model';
import { Profile } from 'src/models/profile.model';
import { CommonModule } from '@angular/common';
import { SessionService } from 'src/services/session.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';

@Component({
  selector: 'app-multiplayer-in-game-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiplayer-in-game-list.component.html',
  styleUrl: './multiplayer-in-game-list.component.scss'
})
export class MultiPlayerInGameListComponent {

  private playersHasAnswered: Profile[] = [];

  constructor(private sessionService: SessionService, private currentProfileService: CurrentProfileService) {
    this.sessionService.playersHasAnswered$.subscribe((playersHasAnswered) => {
      this.playersHasAnswered = playersHasAnswered;
    })
  }

  public getPlayers(): Profile[] {
    return this.playersHasAnswered;
  }

  getInitials(profile: Profile): string {
    if (!profile) return '';

    const firstName = profile.name.charAt(0).toUpperCase();
    const lastName = profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }


}
