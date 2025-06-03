import { Component } from '@angular/core';
import { QuizAppComponent } from 'src/app/components/admin/admin_quizzes/quiz-app/quiz-app.component';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/services/currentPage.service';
import { PopUpCodeComponent } from 'src/app/popup-code/popup-code.component';


@Component({
  selector: 'app-select-quiz-page',
  standalone: true,
  imports: [QuizAppComponent, PopUpCodeComponent],
  templateUrl: './select-quiz-page.component.html',
  styleUrl: './select-quiz-page.component.scss'
})
export class SelectQuizPageComponent {

  constructor(private router: Router, private currentPageService: CurrentPageService) {
    this.currentPageService.setCurrentPage("select-quiz-page");
  }

  public popUp: boolean = false;

  public goTutorial() {
    this.router.navigate(["/solo-tutorial"])
  }

  public leavePage() { this.router.navigate(["/gamemode-selection"]) }

  closePopUp() {
    console.log("close")
    this.popUp = false;
  }

  public showPopUp() { this.popUp = true; }

}
