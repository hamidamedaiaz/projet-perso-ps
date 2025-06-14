import { Component, EventEmitter, Output } from '@angular/core';
import { Quiz } from 'src/models/quiz.model';
import { Router } from '@angular/router';
import { EMPTY_QUIZ } from 'src/mocks/quiz.mock';
import { QuizService } from 'src/services/quiz.service';
import { SessionService } from 'src/services/session.service';
import { CurrentPageService } from 'src/services/currentPage.service';



@Component({
  selector: 'app-multiplayer-game-setup-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './multiplayer-game-setup-sidebar.component.html',
  styleUrl: './multiplayer-game-setup-sidebar.component.scss'
})
export class MultiplayerGameSetupSidebarComponent {

  @Output()
  launch_game: EventEmitter<Boolean> = new EventEmitter<Boolean>();


  public quiz: Quiz = EMPTY_QUIZ;

  public sessionId: String = "None";

  constructor(private router: Router, private sessionService: SessionService, private quizService: QuizService,private currentPageService: CurrentPageService) {
    this.quizService.quiz$.subscribe((quiz) => {
      this.quiz = quiz;
    })
    this.sessionService.sessionId$.subscribe((sessionId) => this.sessionId = sessionId)
  }

  public launchGame() { 
    if(this.sessionService.players.length > 0) this.launch_game.emit(true); 
  }

  public leaveSetup() {
    console.log("Leaving Setup");
    this.sessionService.leaveSetup();
    this.currentPageService.adminNav('quiz');
    this.router.navigate(["/admin"]); 
  }
}
