import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProfileListComponent } from 'src/app/components/admin/profiles/profile-list/profile-list.component';
import { QuizAppComponent } from "../../../components/admin/admin_quizzes/quiz-app/quiz-app.component";
import { ProfileConfigurationComponent } from 'src/app/components/admin/profiles/profile-configuration/profile-configuration.component';
import { QuizListService } from "../../../../services/quiz-list.service";
import { Quiz } from "../../../../models/quiz.model";
import { QuizDetailsComponent } from "../../../components/admin/admin_quizzes/quiz-details/quiz-details.component";
import { Profile } from 'src/models/profile.model';
import { CurrentPageService } from 'src/services/currentPage.service';
import { SelectionListComponent } from "../../../components/admin/admin_statistics/selection-list/selection-list.component";
import { StatsService } from "../../../../services/stats.service";
import { QuizStatsComponent } from "../../../components/admin/admin_statistics/quiz-stats/quiz-stats.component";
import { ActivatedRoute } from "@angular/router";
import { PlayerStatsDetailsComponent } from "../player-stats-details/player-stats-details.component";
import { QuizResultService } from 'src/services/quiz-result.service';
import {PopupComponent} from "../../../components/popup/popup.component";
//import {QuizSectionComponent} from "src/app/components/admin/admin_quizzes/q"
//


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
    NgOptimizedImage,
    ProfileListComponent,
    QuizAppComponent,
    ProfileConfigurationComponent,
    QuizDetailsComponent,
    SelectionListComponent,
    QuizStatsComponent,
    PlayerStatsDetailsComponent,
    PopupComponent
  ],

  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit {
  activeSection: string = 'home';
  activeQuiz: Quiz | null = null;
  selectedProfile: Boolean = false;
  selectedQuizStat: Quiz | null = null;
  selectedIdAcceuilliStats: number = -1;
  showStatsSubmenu: boolean = false;

  @Input()
  public context: string = "admin";

  constructor(
    private quizService: QuizListService,
    private statsService: StatsService,
    private cdr: ChangeDetectorRef, private currentPageService: CurrentPageService,
    private route: ActivatedRoute,
  ) {
    this.currentPageService.setCurrentPage("admin");
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.setSection(params['section']);
      }
    });


    // Permet de quand on clique sur un quiz dans quizDetail ça change de page
    this.quizService.selectedEditQuiz$.subscribe((quiz) => {
      if (quiz !== null) {
        this.setSection('quiz-details');
        this.activeQuiz = quiz;
      }
    });

    this.currentPageService.admin_navigation$.subscribe((val) => {
      this.setSection(val);
    })
  }

  selectQuizStatistics() { this.setSection('quiz-stats'); }

  selectProfileStatistics() { this.setSection('acceuilli-stats'); }

  toggleStatsMenu() { this.showStatsSubmenu = !this.showStatsSubmenu; }

  setSection(section: string) {
    this.activeSection = section;
    console.log('admin - setSection() :', this.activeSection);
    if (section !== 'acceuilli') {
      this.selectedProfile = false;
    }
  }

  onProfileStatsSelected(id: number) {
    this.selectedIdAcceuilliStats = id;
    this.statsService.selectProfile(id);
  }

  onProfileSelect() {
    this.selectedProfile = true;
  }

  closeConfigPanel() {
    this.selectedProfile = false;
    this.cdr.detectChanges();
  }
}
