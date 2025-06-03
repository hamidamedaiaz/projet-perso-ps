import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Profile} from "../../../../../models/profile.model";
import {Quiz} from "../../../../../models/quiz.model";
import {ProfileService} from "../../../../../services/profile.service";
import {QuizListService} from "../../../../../services/quiz-list.service";
import {Router} from "@angular/router";
import {CurrentPageService} from "../../../../../services/currentPage.service";
import {StatsService} from "../../../../../services/stats.service";
import { QuizResultService } from 'src/services/quiz-result.service';

@Component({
  selector: 'app-selection-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './selection-list.component.html',
  styleUrl: './selection-list.component.scss'
})
export class SelectionListComponent implements OnInit{

  profiles: Profile[] = [];
  quizzes: Quiz[] = [];
  selectedProfile: Profile | null = null;
  ITEMS_PER_PAGE = 10;
  currentPage = 1;
  searchQuery = '';
  numberOfPages: number = 1;

  @Input() context : string = "";

  @Output() profile_selected: EventEmitter<number> = new EventEmitter<number>();
  @Output() quiz_selected: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    private profileService: ProfileService,
    private quizService: QuizListService,
    private statService: StatsService,
    private quizResultService:QuizResultService, // Laisser le quizResultService pour qu'il charge les données # Sparadra
  ) {}


  ngOnInit() {
    if(this.context === "acceuilli"){
      this.profileService.profiles$.subscribe(profiles => {
        this.profiles = profiles;
        console.log('Stats, acceuilli , size :', this.profiles.length);
      });
    }

    if(this.context === "quiz"){
      this.quizService.quizzes$.subscribe(quizzes => {
        this.quizzes = quizzes;
        console.log('Stats, quiz , size :', this.quizzes.length);
      })
    }

    this.quizService.quizzes$.subscribe(quizzes => {
      this.quizzes = quizzes;
      this.numberOfPages = Math.floor(this.quizzes.length/this.ITEMS_PER_PAGE);
    });
  }



  filteredProfiles(): Profile[] {
    let filtered = [...this.profiles];

    const query = this.searchQuery.toLowerCase();
    // On récupère les profil de la query
    filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(query) ||
        profile.lastName.toLowerCase().includes(query)
      );
    // on Tri par nom
    filtered.sort((a, b) =>
      (a.lastName + a.name).localeCompare(b.lastName + b.name)
    );

    return filtered.slice((this.currentPage-1)*this.ITEMS_PER_PAGE, (this.currentPage)*this.ITEMS_PER_PAGE);
  }

  filteredQuizzes() : Quiz[]{
    let filtered = [...this.quizzes];

    const query = this.searchQuery.toLowerCase();
    // On récupère les quiz de la query
    filtered = filtered.filter(quiz =>
      quiz.title.toLowerCase().includes(query)
    );
    // on Tri par nom
    filtered.sort((a, b) =>
      (a.title).localeCompare(b.title)
    );

    return filtered.slice((this.currentPage-1)*this.ITEMS_PER_PAGE, (this.currentPage)*this.ITEMS_PER_PAGE);
  }


  getProfileStats(id: number){
    this.profile_selected.emit(id);
    console.log("profile selected, ", id);
    this.statService.selectProfile(id);
  }

  getQuizStat(id : number){
    this.quiz_selected.emit(true);
    this.statService.selectQuiz(id);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  getTotalPages(): number {

    // On le remet la car sinon l'affichage des nombres de page n'est pas dynamique
    const filtered = this.profiles.filter(profile =>
      profile.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      profile.lastName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );


    return Math.max(1, Math.ceil(filtered.length / this.ITEMS_PER_PAGE));  }
}
