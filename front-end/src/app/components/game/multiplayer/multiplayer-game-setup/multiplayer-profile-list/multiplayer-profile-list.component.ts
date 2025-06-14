import { Component } from '@angular/core';
import { ProfileItemComponent } from 'src/app/components/admin/profiles/profile-item/profile-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from 'src/models/profile.model';
import { SocketService } from 'src/services/socket.service';
import { Player } from 'src/models/player.model';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-multiplayer-profile-list',
  standalone: true,
  imports: [ProfileItemComponent, CommonModule, FormsModule],
  templateUrl: './multiplayer-profile-list.component.html',
  styleUrl: './multiplayer-profile-list.component.scss'
})
export class MultiplayerProfileListComponent {

  public searchQuery: string = '';

  protected players: Player[] = [];

  private sessionId: string = "None";

  constructor(private sessionService: SessionService,
    private socketService: SocketService) {

    this.sessionService.players$.subscribe((players) => {
      console.log(players)
      this.players = players;
    })

    this.sessionService.sessionId$.subscribe((sessionId) => this.sessionId = sessionId)
  }

  public filteredPlayers() {
    return this.players.filter(player =>
      player.profile.name.toLowerCase().concat(' ').concat(player.profile.lastName.toLowerCase()).includes(this.searchQuery.toLowerCase())
    );
  }

  public removePlayer(profile: Profile) {
    this.socketService.emit("kick-player", { profile: profile, sessionId: this.sessionId });
    this.sessionService.removePlayerById(this.sessionId, profile.id);
  }

  getInitials(profile : Profile): string {

    const firstName = profile.name.charAt(0).toUpperCase();
    const lastName = profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }

}

