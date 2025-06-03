import { Component } from '@angular/core';
import { Gamemode } from 'src/models/gamemode.model';
import { GamemodeService } from 'src/services/gamemode.service';
import { LocalStorageService } from 'src/services/localstorage.service';


@Component({
  selector: 'app-gamemode-list',
  templateUrl: './gamemode-list.component.html',
  styleUrl: './gamemode-list.component.scss'
})
export class GamemodeListComponent {

  public gamemodeList: Gamemode[] = [];

  constructor(public gamemodeService: GamemodeService){
    this.gamemodeService.gamemodes$.subscribe((gamemodes) => {
      this.gamemodeList = gamemodes;
    });
  }

  gamemodeSelected(id: number) {
    console.log(id)
    if(id === 0){
      this.gamemodeService.playSolo();
    }
    else if(id === 1){
      this.gamemodeService.playMulti();
    } else {
      console.log("Error : Undefied Gamemode")
    }
  }

}
