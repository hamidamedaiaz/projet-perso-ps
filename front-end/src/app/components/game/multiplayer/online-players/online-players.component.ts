import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../../../../services/socket.service';
import { Profile } from '../../../../../models/profile.model';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { QuizService } from "../../../../../services/quiz.service";
import { SessionService } from 'src/services/session.service';
import { PopUpService } from 'src/services/pop-up.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-online-players',
  standalone: true,
  imports: [NgForOf, NgIf, NgStyle],
  templateUrl: './online-players.component.html',
  styleUrl: './online-players.component.scss'
})
export class OnlinePlayersComponent implements OnInit {

  public playerList: Profile[] = [];

  public sessionId: string = "None";

  constructor(private socketService: SocketService, private sessionService: SessionService, private popUpService: PopUpService) {
    this.sessionId = this.sessionService.getSessionId();
    this.socketService.emit('request-for-online-players', {});

  }

  ngOnInit() {

    this.socketService.listen('lobby-connection', data => {
      const player = data as Profile;

      // Évite les doublons si déjà dans la liste
      const alreadyExists = this.playerList.some(p => p.id === player.id);
      if (!alreadyExists) {
        this.playerList.push(player);
        console.log('[CLIENT] - lobby connection listen', player.name);
      }
    });


    this.socketService.listen('lobby-disconnect', data => {
      const player = data as Profile;

      console.log("[CLIENT] - Listen lobby disconnect !!", data)

      const index = this.playerList.findIndex(p => p.id === player.id);
      if (index !== -1) {
        this.playerList.splice(index, 1);
        console.log('[CLIENT] - lobby disconnect ', player.name);
      }
    });

    this.socketService.listen('online-players', data => {
      this.playerList = data.players;
    })


  }

  addToGame(profile: Profile) {
    console.log("[ONLINE PLAYER] - lobby-admin-move-player EMIT SOCKET , ID : " + this.sessionId)
    this.socketService.emit("lobby-admin-move-player", { sessionId: this.sessionId, profile: profile })

    this.popUpService.sendPopup({
      message: "Le joueur va être déplacé dans un instant ...",
      type: "success",
      duration: 3000
    })
  }

  getInitials(profile : Profile): string {

    const firstName = profile.name.charAt(0).toUpperCase();
    const lastName = profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }


}
