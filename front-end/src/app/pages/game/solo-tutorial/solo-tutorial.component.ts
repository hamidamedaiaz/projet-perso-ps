import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/services/currentPage.service';
import { GameTutorialComponent } from 'src/app/components/game/game-tutorial/game-tutorial.component';

@Component({
  selector: 'app-solo-tutorial',
  standalone: true,
  imports: [ CommonModule, GameTutorialComponent ],
  templateUrl: './solo-tutorial.component.html',
  styleUrl: './solo-tutorial.component.scss'
})
export class SoloTutorialComponent {

  public currentStep: number = 1;
  public totalSteps: number = 5;

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
