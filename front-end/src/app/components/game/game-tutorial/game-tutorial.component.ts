import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/services/currentPage.service';

@Component({
  selector: 'app-game-tutorial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-tutorial.component.html',
  styleUrl: './game-tutorial.component.scss'
})
export class GameTutorialComponent {

  public currentStep: number = 1;
  public totalSteps: number = 5;
  public currentPage: String = this.currentPageService.getCurrentPage();

  constructor(
    private router: Router,
    private currentPageService: CurrentPageService
  ) {
    this.currentPageService.setCurrentPage("solo-tutorial");
  }

  public startQuiz(): void {
    this.router.navigate(['/select-quiz']);
  }


  public nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    } else {
      this.startQuiz();
    }
  }

  public previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
