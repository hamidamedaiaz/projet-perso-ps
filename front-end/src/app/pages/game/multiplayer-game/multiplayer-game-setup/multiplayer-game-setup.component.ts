import { Component } from '@angular/core';
import { ProfileListComponent } from 'src/app/components/admin/profiles/profile-list/profile-list.component';
import { MultiplayerGameSetupSidebarComponent } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-game-setup-sidebar/multiplayer-game-setup-sidebar.component';
import { CurrentPageService } from 'src/services/currentPage.service';
import { MultiplayerProfileListComponent } from 'src/app/components/game/multiplayer/multiplayer-game-setup/multiplayer-profile-list/multiplayer-profile-list.component';
import { Router } from '@angular/router';
import { GamemodeService } from 'src/services/gamemode.service';
import { QuizService } from 'src/services/quiz.service';
import { OnlinePlayersComponent } from "src/app/components/game/multiplayer/online-players/online-players.component";
import { SocketService } from 'src/services/socket.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-multiplayer-game-setup',
  standalone: true,
  imports: [
    ProfileListComponent,
    MultiplayerGameSetupSidebarComponent,
    MultiplayerProfileListComponent,
    OnlinePlayersComponent
  ],
  templateUrl: './multiplayer-game-setup.component.html',
  styleUrl: './multiplayer-game-setup.component.scss'
})

export class MultiplayerGameSetupComponent {

  constructor(private gamemodeService: GamemodeService,
    private currentPageService: CurrentPageService,
    private quizService: QuizService,
    private socketService: SocketService,
    private router: Router,
    private sessionService: SessionService) {
    this.currentPageService.setCurrentPage("multiplayer-setup");
  }

  public getNumberOfPlayer() {
    return this.sessionService.getNumberOfPlayers();
  }

  public launchGame() {
    this.gamemodeService.setCurrentGamemode(1);
    this.socketService.emit('start-session', { sessionId: this.sessionService.getSessionId() })
    this.quizService.startQuiz()
    this.router.navigate(['/multiplayer-game'])
  }

}
