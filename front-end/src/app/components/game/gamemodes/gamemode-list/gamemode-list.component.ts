import { Component } from '@angular/core';
import { Gamemode } from 'src/models/gamemode.model';
import { GamemodeService } from 'src/services/gamemode.service';


@Component({
  selector: 'app-gamemode-list',
  templateUrl: './gamemode-list.component.html',
  styleUrl: './gamemode-list.component.scss'
})
export class GamemodeListComponent {

  public gamemodeList: Gamemode[] = [];

  constructor(public gamemodeService: GamemodeService) {
    this.gamemodeService.gamemodes$.subscribe((gamemodes) => {
      this.gamemodeList = gamemodes;
    });
  }

  gamemodeSelected(id: number) {
    switch (id) {
      case 0:
        this.gamemodeService.playSolo();
        break;
      case 1:
        this.gamemodeService.playMulti();
        break
      default:
        console.error("Error : Undefied Gamemode")
    }
  }

}
