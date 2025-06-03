import { Injectable } from '@angular/core';
import {BehaviorSubject, interval} from 'rxjs';
import { Player } from 'src/models/player.model';
import { SocketService } from './socket.service';
import { QuizService } from './quiz.service';
import { Router } from '@angular/router';
import { QuizListService } from './quiz-list.service';
import { LocalStorageService } from './localstorage.service';
import { Profile } from 'src/models/profile.model';
import { CurrentProfileService } from './currentProfile.service';
import {GamemodeService} from "./gamemode.service";
import {PopUpService} from "./pop-up.service";
import { RealTimeStatsService } from './real-time-stats.service';
@Injectable({
    providedIn: 'root'
})

export class SessionService {

    public players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);

    private sessionId = "None";

    public sessionId$: BehaviorSubject<string> = new BehaviorSubject<string>(this.sessionId);

    private readonly PLAYERS_KEY: string = "PLAYERS";

    constructor(private socketService: SocketService,
        private quizService: QuizService,
        private router: Router,
        private quizListService: QuizListService,
        private localStorageService: LocalStorageService,
        private currentProfileService: CurrentProfileService,
        private gamemodeService : GamemodeService,
        private popupService : PopUpService,
        private realTimeStatsService: RealTimeStatsService) {

        this.initSocketListeners();
    }

    private initSocketListeners() {


        // QUIZ SERVICE

        this.socketService.listen('quiz-started', (data) => {
            if (this.sessionId === data.sessionId) {
                this.quizService.startQuiz();
            }
        })

        this.socketService.listen('player-has-answered', (data) => {
            if (this.sessionId === data.sessionId) {
                this.savePlayerAnswer(data.playerId, data.answer.id);
            }
        })

        this.socketService.listen('next-question', (data) => {
            if (data.sessionId === this.sessionId) {
                this.resetPlayersAnswers();
                this.quizService.nextQuestion();
            }
        })

        this.socketService.listen('quiz-joined-success', (data) => {
            if (data.quizId !== -1) {
                const quiz = this.quizListService.getQuiz(data.quizId)
                this.quizService.setQuiz(quiz)
                this.setSessionId(data.sessionId);
                this.gamemodeService.setCurrentGamemode(1);
                let timeLeft = 3;
              this.popupService.sendPopup({
                message : "Vous allez être déplacé dans une session de groupe dans 4 secondes",
                type : "info",
                duration : 5000
              })
                let timer = interval(1000).subscribe(() => {
                  this.popupService.sendPopup({
                    message : "Vous allez être déplacé dans une session de groupe dans " + timeLeft + " secondes",
                    type : "info",
                    duration : 3000
                  })
                  timeLeft -= 1;
                  if(timeLeft == 0){
                    timer.unsubscribe();
                  }
                })
                setTimeout( () =>{

                  this.socketService.emit("lobby-disconnect", this.currentProfileService.getCurrentProfile());
                  this.router.navigate(["/waiting-start"]);
                }, 4000)

            }
        })

        this.socketService.listen('player-has-joined-session', (data) => {
            this.addPlayer(data.sessionId, data.profile);
        })

        this.socketService.listen('leave-session-success', () => {
            this.router.navigate(['/multiplayer-game-login'])
        })

        this.socketService.listen('kicked', (data) => {
            if (data.sessionId === this.sessionId) {
                this.socketService.emit("lobby-connection", this.currentProfileService.getCurrentProfile());
                this.router.navigate(['/multiplayer-game-login'])
            }
        })

        this.socketService.listen('quiz-started', (data) => {
            this.quizService.startQuiz();
            this.router.navigate(['/multiplayer-game']);
        })

        this.socketService.listen('leave-session-success', () => {
            this.router.navigate(['/multiplayer-game-login'])
        })

        this.socketService.listen('kicked', (data) => {
            if (data.sessionId === this.sessionId) this.router.navigate(['/multiplayer-game-login'])
        })

        this.socketService.listen('player-has-joined-session', (data) => {
            this.addPlayer(this.sessionId, data.profile)
        })

        this.socketService.listen('player-has-leaved-session', (data) => {
            this.removePlayerById(this.sessionId, data.profile.id)
        })

        this.socketService.listen('player-disconnected', (data) => {
            this.removePlayerById(this.sessionId, data.profileId)
        })

        this.socketService.listen("client-game-move", (data) => {
            console.log("[CLIENT] - Demande de move recu : ", data)
            const profile = this.currentProfileService.getCurrentProfile();
            this.socketService.emit("join-session", { sessionId: data.code, profile: profile })
        })


    }

    public getPlayers(): Player[] { return this.players$.getValue() }



    public leaveSetup() {
        this.players$.next([]);
        this.socketService.emit('leave-admin', { sessionId: this.sessionId });
        this.quizService.resetCurrentQuiz();
    }

    public leaveMultiplayerQuiz() {
        this.players$.next([]);
        this.socketService.emit('leave-admin', { sessionId: this.sessionId });
        this.quizService.resetCurrentQuiz();
    }

    public savePlayerAnswer(playerId: number, answerId: number) {
        console.log(playerId, answerId);

        const players = this.getPlayers();
        players.forEach((player) => {
            if (player.profile.id === playerId) {
                player.hasAnswered = true;
            }
        })

        this.players$.next(players);

        
         const currentQuestion = this.quizService.question$.getValue();

     if (currentQuestion && currentQuestion.id !== -1) {
        this.realTimeStatsService.addAnswer(this.sessionId, currentQuestion.id, answerId);
     }

        if (this.verifyPlayersHasAllAnswered()) {
            this.socketService.emit('all-player-has-answered', { sessionId: this.sessionId })
        }
    }

    // SESSION MANAGEMENT

    public removePlayerById(sessionId: string, playerId: number) {
        if (this.sessionId === sessionId) {
            let players = this.getPlayers()
            players = players.filter((p) => p.profile.id !== playerId);
            this.players$.next(players);
        }
    }

    public addPlayer(sessionId: string, profile: Profile) {
        if (this.sessionId === sessionId) {

            const players = this.getPlayers()
            const player = this.generateNewPlayer(profile)
            if (this.playerAlreadyExists(player)) return;
            players.push(player);
            this.players$.next(players);

            this.localStorageService.removeItem(this.PLAYERS_KEY)
            this.localStorageService.storeItem(this.PLAYERS_KEY, JSON.stringify(players));
        }
    }

    public getNumberOfPlayers(): number { return this.getPlayers().length }

    private generateNewPlayer(profile: Profile): Player {
        const player: Player = { profile: profile, hasAnswered: false }
        return player;
    }

    private playerAlreadyExists(player: Player): boolean {
        const found = this.getPlayers().find(playerFromList => playerFromList.profile.id === player.profile.id)
        if (found) return true;
        return false;
    }

    private verifyPlayersHasAllAnswered() {
        let hasAllAnswered: boolean = true;
        this.getPlayers().forEach((player) => {
            if (!player.hasAnswered) hasAllAnswered = false;
        })
        return hasAllAnswered;
    }

    public getNumberOfGivenAnswers() {
        let counter = 0;
        this.getPlayers().forEach((player) => {
            if (player.hasAnswered) counter++;
        })
        return counter;
    }

    public resetPlayersAnswers() {
        const players = this.getPlayers();
        players.forEach((player) => player.hasAnswered = false)
        this.players$.next(players);
    }


    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
        this.sessionId$.next(sessionId);
    }
 public initializeStatsForSession() {
    this.realTimeStatsService.initSession(this.sessionId);
}


    public getSessionId() { return this.sessionId; }
}
