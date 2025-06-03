import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Gamemode } from 'src/models/gamemode.model';

@Component({
  selector: 'app-gamemode',
  templateUrl: './gamemode.component.html',
  styleUrl: './gamemode.component.scss'
})
export class GamemodeComponent {

  @Input()
  gamemode: Gamemode | undefined;

  @Output()
  gamemodeSelected: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  selectGamemode() {
    this.gamemodeSelected.emit(true);
  }
}
