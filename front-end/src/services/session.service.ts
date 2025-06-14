import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Player } from 'src/models/player.model';
import { SocketService } from './socket.service';
import { QuizService } from './quiz.service';
import { Router } from '@angular/router';
import { QuizListService } from './quiz-list.service';
import { LocalStorageService } from './localstorage.service';
import { Profile } from 'src/models/profile.model';
import { CurrentProfileService } from './currentProfile.service';
import { GamemodeService } from "./gamemode.service";
import { PopUpService } from "./pop-up.service";
import { RealTimeStatsService } from './real-time-stats.service';
import { RecordResultService } from './record-result.service';
@Injectable({
    providedIn: 'root'
})

export class SessionService {

    public players: Player[] = [];

    public players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>(this.players);

    private sessionId = "None";

    public sessionId$: BehaviorSubject<string> = new BehaviorSubject<string>(this.sessionId);

    public playersHasAnswered: Profile[] = [];

    public playersHasAnswered$: BehaviorSubject<Profile[]> = new BehaviorSubject<Profile[]>(this.playersHasAnswered);

    private adminSessionId: string = 'None';

    private readonly PLAYERS_KEY: string = "PLAYERS";

    private readonly PLAYERS_HAS_ANSWERED_KEY: string = "PLAYERS_HAS_ANSWERED_KEY"

    private readonly SESSION_ID_KEY: string = "SESSION_ID_KEY"

    private readonly ADMIN_SESSION_ID_KEY: string = "ADMIN_SESSION_ID_KEY"

    constructor(private socketService: SocketService,
        private quizService: QuizService,
        private router: Router,
        private quizListService: QuizListService,
        private localStorageService: LocalStorageService,
        private currentProfileService: CurrentProfileService,
        private gamemodeService: GamemodeService,
        private popupService: PopUpService,
        private realTimeStatsService: RealTimeStatsService,
        private localStorage: LocalStorageService,
        private recordResultService: RecordResultService) {

        this.initSocketListeners();
        this.loadLocalStorage();
    }

    private loadLocalStorage(): void {

        const savedSessionId = this.localStorageService.getItem(this.SESSION_ID_KEY);
        const savedPlayers = this.localStorageService.getItem(this.PLAYERS_KEY)
        const savedPlayersHasAnswered = this.localStorageService.getItem(this.PLAYERS_HAS_ANSWERED_KEY)
        const savedAdminSessionId = this.localStorageService.getItem(this.ADMIN_SESSION_ID_KEY);

        if (savedSessionId) {
            this.sessionId = savedSessionId;
            this.sessionId$.next(savedSessionId);
        }

        if (savedPlayers) {
            this.players = savedPlayers;
            this.players$.next(this.players);
        }

        if (savedPlayersHasAnswered) {
            this.playersHasAnswered = savedPlayersHasAnswered;
            this.playersHasAnswered$.next(this.playersHasAnswered);
        }

        if (savedAdminSessionId) this.adminSessionId = savedAdminSessionId;
    }

    private initSocketListeners(): void {

        this.socketService.listen('player-has-answered', (data) => {
            if (this.sessionId === data.sessionId) {
                this.savePlayerAnswer(data.profile, data.answer.id);
            }
        })

        this.socketService.listen('next-question', (data) => {
            if (data.sessionId === this.sessionId) {
                console.log('SESSION ID NEXT QUESTION ', this.sessionId);
                this.resetPlayersAnswers();
                this.quizService.nextQuestion();
            }
        })

        this.socketService.listen('quiz-joined-success', (data) => {
            if (data.quizId !== -1) {
                this.resetSession();
                const quiz = this.quizListService.getQuiz(data.quizId);
                this.recordResultService.setSessionId(data.sessionId);
                this.quizService.setQuiz(quiz);
                this.setSessionId(data.sessionId);
                this.gamemodeService.setCurrentGamemode(1);
                this.addPlayers(data.sessionId, data.players);
                this.socketService.emit("lobby-disconnect", this.currentProfileService.getCurrentProfile());
                this.router.navigate(["/waiting-start"]);
            }
        })

        this.socketService.listen('player-has-joined-session', (data) => {
            this.addPlayer(data.sessionId, data.profile);
        })

        this.socketService.listen('leave-session-success', () => {
            this.resetSession();
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
            console.log('SESSION ID START ', this.sessionId);
            this.resetPlayersAnswers();
            this.recordResultService.setPlayers(this.players);
            this.router.navigate(['/multiplayer-game']);
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

            let timeLeft = 2;
            this.popupService.sendPopup({
                message: "Vous allez être déplacé dans une session de groupe dans 3 secondes",
                type: "info",
                duration: 3000
            })

            let timer = interval(1000).subscribe(() => {
                this.popupService.sendPopup({
                    message: "Vous allez être déplacé dans une session de groupe dans " + timeLeft + " secondes",
                    type: "info",
                    duration: 3000
                })
                timeLeft -= 1;
                if (timeLeft == 0) {
                    timer.unsubscribe();
                }
            })

            setTimeout(() => {
                this.socketService.emit("lobby-disconnect", this.currentProfileService.getCurrentProfile());
                this.socketService.emit("join-session", { sessionId: data.code, profile: profile })
            }, 3000)

        })
    }

    public generateAdminSessionId(): void {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint8Array(12);
        crypto.getRandomValues(array);
        this.adminSessionId = Array.from(array, byte => charset[byte % charset.length]).join('');
        this.localStorage.removeItem(this.ADMIN_SESSION_ID_KEY)
        this.localStorage.storeItem(this.ADMIN_SESSION_ID_KEY, JSON.stringify(this.adminSessionId));
    }

    public getAdminSessionId(): string {
        return this.adminSessionId
    }

    public getPlayers(): Player[] {
        return this.players;
    }


    public leaveSetup() {
        this.players = [];
        this.players$.next(this.players);
        this.socketService.emit('leave-admin', { sessionId: this.sessionId });
        this.quizService.resetCurrentQuiz();
    }

    public leaveMultiplayerQuiz() {
        this.players = [];
        this.players$.next(this.players);
        this.socketService.emit('leave-admin', { sessionId: this.sessionId });
        this.quizService.resetCurrentQuiz();
    }

    public savePlayerAnswer(profile: Profile, answerId: number) {

        if (!this.playersHasAnswered.includes(profile)) {
            this.playersHasAnswered.push(profile)
            this.playersHasAnswered$.next(this.playersHasAnswered);
            this.localStorageService.storeItem(this.PLAYERS_HAS_ANSWERED_KEY, JSON.stringify(this.playersHasAnswered));
        }

        const currentQuestion = this.quizService.question$.getValue();

        if (currentQuestion && currentQuestion.id !== -1) {
            this.realTimeStatsService.addAnswer(this.sessionId, currentQuestion.id, answerId);

        }

        if (this.verifyPlayersHasAllAnswered()) {
            this.socketService.emit('all-player-has-answered', { sessionId: this.sessionId });
        }
    }


    // SESSION MANAGEMENT

    public removePlayerById(sessionId: string, playerId: number) {
        if (this.sessionId === sessionId) {
            this.players = this.players.filter((p) => p.profile.id !== playerId);
            this.players$.next(this.players);

            this.localStorageService.removeItem(this.PLAYERS_KEY)
            this.localStorageService.storeItem(this.PLAYERS_KEY, JSON.stringify(this.players));
        }
    }

    public addPlayer(sessionId: string, profile: Profile) {
        console.log(sessionId, this.sessionId)
        if (this.sessionId === sessionId) {

            const player = this.generateNewPlayer(profile)
            if (this.playerAlreadyExists(player)) return;
            this.players.push(player);
            this.players$.next(this.players);

            this.localStorageService.removeItem(this.PLAYERS_KEY)
            this.localStorageService.storeItem(this.PLAYERS_KEY, JSON.stringify(this.players));
        }
    }

    public addPlayers(sessionId: string, profiles: Profile[]) {
        profiles.forEach(profile => this.addPlayer(sessionId, profile))
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
        return this.players.length === this.playersHasAnswered.length;
    }

    public getNumberOfGivenAnswers() {
        return this.playersHasAnswered.length;
    }

    public resetPlayersAnswers() {
        this.playersHasAnswered = [];
        this.playersHasAnswered$.next(this.playersHasAnswered);

        this.localStorageService.removeItem(this.PLAYERS_HAS_ANSWERED_KEY)
        this.localStorageService.storeItem(this.PLAYERS_HAS_ANSWERED_KEY, JSON.stringify(this.playersHasAnswered));
    }

    public setSessionId(sessionId: string) {

        this.sessionId = sessionId;
        this.sessionId$.next(sessionId);

        console.log(this.sessionId)

        this.localStorageService.removeItem(this.SESSION_ID_KEY)
        this.localStorageService.storeItem(this.SESSION_ID_KEY, JSON.stringify(sessionId));
    }

    public initializeStatsForSession() {
        this.realTimeStatsService.initSession(this.sessionId);
    }

    public getSessionId() { return this.sessionId; }

    public resetSession() {
        this.sessionId = 'None';
        this.sessionId$.next(this.sessionId);
        this.players = [];
        this.players$.next(this.players);

        this.localStorageService.storeItem(this.SESSION_ID_KEY, JSON.stringify(this.sessionId))
        this.localStorageService.storeItem(this.PLAYERS_KEY, JSON.stringify(this.getPlayers()));
    }

    public connect() {
        if (this.currentProfileService.getCurrentProfile().role === 'admin') {
            this.socketService.emit('admin-login', { sessionId: this.sessionId, adminSessionId: this.adminSessionId })
        } else {
            this.socketService.emit('login', {
                sessionId: this.sessionId,
                profile: this.currentProfileService.getCurrentProfile()
            })
        }
    }
}
