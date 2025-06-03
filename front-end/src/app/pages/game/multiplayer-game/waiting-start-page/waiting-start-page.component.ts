import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/services/quiz.service'
import { CurrentPageService } from 'src/services/currentPage.service';
import { QuizListService } from 'src/services/quiz-list.service';
import { GameTutorialComponent } from 'src/app/components/game/game-tutorial/game-tutorial.component';
import { SocketService } from 'src/services/socket.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-waiting-start-page',
  standalone: true,
  imports: [GameTutorialComponent],
  templateUrl: './waiting-start-page.component.html',
  styleUrl: './waiting-start-page.component.scss'
})


export class WaitingStartPageComponent {

  private redirectionTimer: any = null;

  private gamefoundTimer: any = null;

  public gameIsReady: boolean = false;

  public waiting_message: string = "En attente du début de la partie";

  private sessionId:string = "None"

  constructor(private router: Router,
    private quizService: QuizService,
    private quizListService: QuizListService,
    private currentPageService: CurrentPageService,
    private socketService: SocketService,
    private currentProfileService: CurrentProfileService,
    private sessionService: SessionService) {
    this.currentPageService.setCurrentPage("waiting-start-page")
    this.sessionService.sessionId$.subscribe((sessionId) => this.sessionId = sessionId);
  }

  public setWaitingMessage(message: string) {
    this.waiting_message = message;
  }

  public setGameReady() { this.gameIsReady = true; }

  public redirectToOnlineGame() {
    //On set un quiz par defaut pour la demo
    this.quizService.setQuiz(this.quizListService.quizzes$.getValue()[0]);
    this.quizService.startQuiz();
    this.router.navigate(['/multiplayer-game']);
  }

  public leaveQueue() {
    if (this.redirectionTimer) clearTimeout(this.redirectionTimer)
    this.router.navigate(['/multiplayer-game-login'])
    this.socketService.emit("leave-session", { profile: this.currentProfileService.getCurrentProfile(), sessionId: this.sessionId })
    this.socketService.emit("lobby-connection", this.currentProfileService.getCurrentProfile());
  }
}
