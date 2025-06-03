import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Gamemode } from "../models/gamemode.model";
import { GAMEMODE_UNDEFINED } from "../mocks/gamemode-list.mock";
import { CurrentProfileService } from "./currentProfile.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "./localstorage.service";
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class GamemodeService {

    private gamemodes: Gamemode[] = [];

    private apiUrl = "http://localhost:9428/api/gamemodes";

    public gamemodes$: BehaviorSubject<Gamemode[]> = new BehaviorSubject<Gamemode[]>(this.gamemodes);

    private current_gamemode: Gamemode = GAMEMODE_UNDEFINED;

    constructor(private currentProfileService: CurrentProfileService, private localStorageService: LocalStorageService, private router: Router, private http: HttpClient) {
      this.loadFromStorage();
      this.getGamemodes();
    }

    private getGamemodes():void{
       this.http.get<Gamemode[]>(this.apiUrl).subscribe((gamemodes: Gamemode[]) => {
            console.log("Gamemodes récupérés :", gamemodes);
            this.gamemodes = gamemodes
            this.gamemodes$.next(gamemodes)

      });
    }

    private loadFromStorage(): void {
      const savedGamemode = this.localStorageService.getItem('Gamemode');

      if (savedGamemode) {
        this.current_gamemode = savedGamemode;
      }
    }

    playSolo(){
      console.log(this.currentProfileService.getCurrentProfile(), " is playing singleplayer");
      this.setCurrentGamemode(0)
      ///  on  Rediriger vers le tutorial au lieu de select-quiz directement
      this.router.navigate(['/select-quiz']);
}

    playMulti(){
      console.log(this.currentProfileService.getCurrentProfile(), " is playing multiplayer");
      this.setCurrentGamemode(1)
      this.router.navigate(['/multiplayer-game-login']);
    }

    public getCurrentGamemode(){
      return this.current_gamemode;
    }

    public setCurrentGamemode(gamemode_id : number): void {
      const foundGamemode = this.gamemodes.find(gamemode => gamemode.id === gamemode_id);

      console.log("gamemode Id ", this.gamemodes)

      if (foundGamemode) {
        this.current_gamemode = foundGamemode;
        console.log("Gamemode Select: ", foundGamemode.name)
        this.localStorageService.storeItem("Gamemode",JSON.stringify(foundGamemode))
      } else {
        this.current_gamemode = GAMEMODE_UNDEFINED;
        console.log("No gamemode found with name: ", gamemode_id);
        this.localStorageService.storeItem("Gamemode",JSON.stringify(GAMEMODE_UNDEFINED))
      }

    }



}
