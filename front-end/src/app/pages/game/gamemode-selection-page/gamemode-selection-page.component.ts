import {Component, OnInit} from '@angular/core';
import { CurrentPageService } from 'src/services/currentPage.service';
import {SocketService} from "../../../../services/socket.service";
import {CurrentProfileService} from "../../../../services/currentProfile.service";

@Component({
  selector: 'app-gamemode-selection-page',
  templateUrl: './gamemode-selection-page.component.html',
  styleUrl: './gamemode-selection-page.component.scss'
})

export class GamemodeSelectionComponent{

  constructor(private currentPageService:CurrentPageService, private socketService : SocketService, private currentProfileService : CurrentProfileService){
    this.currentPageService.setCurrentPage("gamemode-selection");
  }

  leavePage(){
    this.socketService.emit("lobby-disconnect", this.currentProfileService.getCurrentProfile());
  }

}
