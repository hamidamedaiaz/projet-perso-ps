import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiplayerGameSetupComponent } from "./pages/game/multiplayer-game/multiplayer-game-setup/multiplayer-game-setup.component";
import { HomeComponent } from "./pages/home/home.component";
import { AdminPageComponent } from "./pages/admin/admin-page/admin-page.component";
import { GamemodeSelectionComponent } from "./pages/game/gamemode-selection-page/gamemode-selection-page.component";
import { SingleplayerGamePageComponent } from './pages/game/singleplayer-game/singleplayer-game-page/singleplayer-game-page.component';
import { MultiplayerGamePageComponent } from './pages/game/multiplayer-game/multiplayer-game-page/multiplayer-game-page.component';
import { MultiplayerGameLoginPageComponent } from './pages/game/multiplayer-game/multiplayer-game-login-page/multiplayer-game-login-page.component';
import { WaitingStartPageComponent } from './pages/game/multiplayer-game/waiting-start-page/waiting-start-page.component';
import { SelectQuizPageComponent } from './pages/game/select-quiz-page/select-quiz-page.component';
import { PlayerStatsDetailsComponent } from './pages/admin/player-stats-details/player-stats-details.component';
import { QuizResultDetailsComponent } from './pages/admin/quiz-result-details/quiz-result-details.component';
import { QuizScoreboardComponent } from './pages/game/singleplayer-game/quiz-scoreboard/quiz-scoreboard.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { AnswerSubmittedPageComponent } from './pages/game/multiplayer-game/answer-submitted-page/answer-submitted-page.component';
import { QuizMultiplayerScoreboardComponent } from './pages/game/multiplayer-game/quiz-multiplayer-scoreboard/quiz-multiplayer-scoreboard.component';
import { SoloTutorialComponent } from './pages/game/solo-tutorial/solo-tutorial.component';


const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'admin', component: AdminPageComponent},
  {path:'multiplayer-game-setup', component : MultiplayerGameSetupComponent},
  {path:'gamemode-selection', component: GamemodeSelectionComponent},
  {path:'singleplayer-game',component: SingleplayerGamePageComponent},
  {path:'multiplayer-game-login', component: MultiplayerGameLoginPageComponent},
  {path:'multiplayer-game',component: MultiplayerGamePageComponent},
  {path:'waiting-start', component:WaitingStartPageComponent},
  {path:'select-quiz', component:SelectQuizPageComponent},
  {path:'quiz-scoreboard', component:QuizScoreboardComponent},
  {path:'player-stats/:id', component: PlayerStatsDetailsComponent},
  {path:'quiz-result/:profileId/:quizId', component: QuizResultDetailsComponent},
  {path:'quiz-scoreboard',component:QuizScoreboardComponent},
  {path: 'answer-submitted', component:AnswerSubmittedPageComponent},
  {path: 'quiz-multiplayer-scoreboard', component:QuizMultiplayerScoreboardComponent},
  {path:'solo-tutorial', component: SoloTutorialComponent},



  {path:'**',component: NotFoundPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
