import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizListService } from 'src/services/quiz-list.service';
import { ProfileService } from 'src/services/profile.service';
import { QuizResultService } from 'src/services/quiz-result.service';
import { Quiz } from 'src/models/quiz.model';
import { Profile } from 'src/models/profile.model';
import { QuizResult } from 'src/models/quiz-result.model';
import { QuizResultHeaderComponent } from 'src/app/components/admin/admin_statistics/quiz-results/quiz-result-header/quiz-result-header.component';
import { QuizResultInfoComponent } from 'src/app/components/admin/admin_statistics/quiz-results/quiz-result-info/quiz-result-info.component';
import { QuizResultQuestionsComponent } from 'src/app/components/admin/admin_statistics/quiz-results/quiz-result-questions/quiz-result-questions.component';
import { QuizPlayersListComponent } from 'src/app/components/admin/admin_statistics/quiz-results/quiz-players-list/quiz-players-list.component';
import { StatsService } from 'src/services/stats.service';
import { PopUpCodeComponent } from 'src/app/popup-code/popup-code.component';

@Component({
  selector: 'app-quiz-result-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    QuizResultHeaderComponent,
    QuizResultInfoComponent,
    QuizResultQuestionsComponent,
    QuizPlayersListComponent,
    PopUpCodeComponent
  ],
  templateUrl: './quiz-result-details.component.html',
  styleUrl: './quiz-result-details.component.scss'
})
export class QuizResultDetailsComponent {

  private profileId: number = -1;
  private profile!: Profile;
  private quizResult: QuizResult | null = null;
  private quizSessionId: number = -1;
  private quiz!: Quiz;
  public isQuizMulti: Boolean = true;
  public activeTab: string = "questions"

  public popUp: boolean = false;

  @Output()
  go_back: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private statsService: StatsService,
    private profileService: ProfileService,
    private quizListService: QuizListService,
    private quizResultService: QuizResultService
  ) {
    //RETRIEVE USER ID AND QUIZ ID
    this.statsService.quizResultId$.subscribe((quizResultId) => this.quizSessionId = quizResultId); //quizSessionId
    this.statsService.profileId$.subscribe((profileId) => this.profileId = profileId);

    //SAVE THEIRS INFORMATIONS

    this.quizResult = this.quizResultService.getQuizResult(this.quizSessionId) //this.quizResultService.getQuizResultById(this.quizSessionId);

    this.quizResult.gamemode.id === 1 ? this.isQuizMulti = true : this.isQuizMulti = false;

    this.profileService.getProfile(this.profileId).subscribe((profile) => this.profile = profile);

    this.quiz = this.quizListService.getQuiz(this.quizResult!.quizId)
  }

  public getProfileListFromQuizResult() {
    if (this.quizResult) return this.quizResultService.getProfilesInSession(this.quizResult.sessionId)
    return [];
  }



  getProfile() { return this.profile }

  getQuiz() { return this.quiz }

  getQuestionResults() { return this.quizResult!.questionResults }

  getDateDebut() { return this.quizResult!.dateDebut; }

  setActiveTab(tabName: string) { if (tabName === 'questions' || tabName === 'players') this.activeTab = tabName }

  navigateBack() { this.go_back.emit(true); }

  goToQuizResultDetails() {

  }

  closePopUp() {
    this.popUp = false;
  }

  public showPopUp() {
    this.popUp = true;
  }

  async deleteQuizResult() {
    try {
      await this.statsService.deleteQuizResult();
      this.navigateBack(); // Seulement après succès
    } catch (err) {
      alert("Erreur lors de la suppression !");
      console.error(err);
    }
  }
}


