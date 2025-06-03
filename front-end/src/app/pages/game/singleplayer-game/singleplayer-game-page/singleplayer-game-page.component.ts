import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/models/profile.model';
import { CurrentPageService } from 'src/services/currentPage.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { QuizQuestionComponent } from 'src/app/components/game/quizzes/quiz-question/quiz-question.component';
import { QuizService } from 'src/services/quiz.service';
import { CommonModule } from '@angular/common';
import { SocketService } from 'src/services/socket.service';


@Component({
  selector: 'app-singleplayer-page',
  standalone: true,
  imports: [QuizQuestionComponent, CommonModule],
  templateUrl: './singleplayer-game-page.component.html',
  styleUrl: './singleplayer-game-page.component.scss'
})

export class SingleplayerGamePageComponent {

  public fontSize: string = '';

  constructor(private router: Router,
    private currentPageService: CurrentPageService,
    private quizService: QuizService,
    private socketService: SocketService,
    private currentProfileService: CurrentProfileService) {
    this.currentPageService.setCurrentPage("singleplayer-game")
  }

  public leaveQuiz() {
    this.quizService.resetCurrentQuiz();
    this.socketService.emit("lobby-connection", this.currentProfileService.getCurrentProfile());
    this.router.navigate(["/select-quiz"]);
  }

}
