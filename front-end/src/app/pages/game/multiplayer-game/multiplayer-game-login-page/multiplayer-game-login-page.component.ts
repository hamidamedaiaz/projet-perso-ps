import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/services/currentPage.service';
import { FormsModule } from '@angular/forms';
import { PopUpCodeComponent } from 'src/app/popup-code/popup-code.component';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { SocketService } from 'src/services/socket.service';
import { SessionService } from 'src/services/session.service';
@Component({
  selector: 'app-multiplayer-game-login-page',
  standalone: true,
  imports: [FormsModule, PopUpCodeComponent],
  templateUrl: './multiplayer-game-login-page.component.html',
  styleUrl: './multiplayer-game-login-page.component.scss'
})
export class MultiplayerGameLoginPageComponent implements OnInit {

  public code: string = "";

  private JOIN_GAME_MESSAGE: string = "Rejoindre une partie"

  private INVALID_CODE: string = "Code Invalide"

  public message: string = "";

  public popUp: boolean = false;

  constructor(private router: Router,
    private currentPageService: CurrentPageService,
    private currentProfileService: CurrentProfileService,
    private socketService: SocketService,
    private sessionService: SessionService) {
    this.currentPageService.setCurrentPage("multiplayer-game-login-page")
    this.sessionService.connect();
  }

  ngOnInit(): void { this.message = this.JOIN_GAME_MESSAGE; }

  public async joinGame() {
    if (this.code === "") this.message = this.INVALID_CODE;

    else {
      const profile = this.currentProfileService.getCurrentProfile();
      this.socketService.emit("join-session", { sessionId: this.code, profile: profile })
    }

  }

  public leavePage() {
    this.currentProfileService.resetCurrentProfile();
    this.router.navigate(["/"])
  }

  closePopUp() { this.popUp = false; }

  public showPopUp() { this.popUp = true; }

}
