import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from 'src/models/profile.model';
import { CurrentPageService } from "src/services/currentPage.service";
import { ProfileService } from 'src/services/profile.service';
import { GUEST_PROFILE } from 'src/mocks/profile-list.mock';



@Component({

  selector: 'app-player-stats-header',

  standalone: true,

  imports: [CommonModule],
  templateUrl: './player-stats-header.component.html',

  styleUrls: ['./player-stats-header.component.scss']

})


export class PlayerStatsHeaderComponent {


  @Input() profile!:Profile;

  constructor(private navigation: CurrentPageService) { }

  navigateBack() { this.navigation.adminNav('selection-stat-acceuilli') }

  getProfile(){ return this.profile }


  getInitials(): string {

    if (!this.profile) {
      console.log("Error - Profile not found"); 
      return '';
    }

    const firstName = this.profile.name.charAt(0).toUpperCase();
    const lastName = this.profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }


}
