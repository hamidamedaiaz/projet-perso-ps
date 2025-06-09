import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/models/profile.model';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { CurrentPageService } from 'src/services/currentPage.service';
import { QuizQuestionComponent } from 'src/app/components/game/quizzes/quiz-question/quiz-question.component';
import { CommonModule } from '@angular/common';
import { PopUpCodeComponent } from 'src/app/popup-code/popup-code.component';
import { SessionService } from 'src/services/session.service';
import { SocketService } from 'src/services/socket.service';

@Component({
  selector: 'app-multiplayer-game-page',
  standalone: true,
  imports: [QuizQuestionComponent, CommonModule, PopUpCodeComponent],
  templateUrl: './multiplayer-game-page.component.html',
  styleUrl: './multiplayer-game-page.component.scss'
})
export class MultiplayerGamePageComponent {

  private currentProfile: Profile | undefined;

  public popUp: boolean = false;

  constructor(private router: Router,
    private currentProfileService: CurrentProfileService,
    private currentPageService: CurrentPageService,
    private sessionService: SessionService,
    private socketService: SocketService) {
    this.currentProfileService.current_profile$.subscribe((currentProfile) => {
      this.currentProfile = currentProfile;
    })
    this.currentPageService.setCurrentPage("multiplayer-game-page")
    this.socketService.emit('login', {
      sessionId: this.sessionService.getSessionId(),
      profile: this.currentProfileService.getCurrentProfile()
    })
  }

  public leaveQuiz() {
    this.sessionService.leaveMultiplayerQuiz();
    this.router.navigate(["/admin"]);
  }

  public getRole() {
    return this.currentProfile?.role
  }

  public closePopUp() { this.popUp = false; }

  public showPopUp() { this.popUp = true; }

}
