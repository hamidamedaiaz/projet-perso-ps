import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/services/currentPage.service';
import { GamemodeService } from 'src/services/gamemode.service';

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
    private currentPageService: CurrentPageService,
    private gamemodeService:GamemodeService
  ) {
    this.currentPageService.setCurrentPage("solo-tutorial");
  }

  public leaveToQuizSelection(): void {
    this.router.navigate(['/select-quiz']);
  }

  public leaveToMulti(): void {
    this.router.navigate(['/waiting-start']);
  }

  public nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    } else {
      if(this.gamemodeService.getCurrentGamemode().id === 0) this.leaveToQuizSelection();
      else if (this.gamemodeService.getCurrentGamemode().id === 1) this.leaveToMulti();
    }
  }

  public getCurrentGamemodeId(){
    return this.gamemodeService.getCurrentGamemode().id;
  }

  public previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
