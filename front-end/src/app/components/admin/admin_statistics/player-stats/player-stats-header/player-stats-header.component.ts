import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from 'src/models/profile.model';
import { CurrentPageService } from "src/services/currentPage.service";
import { environment } from 'src/environments/environment.development';
@Component({

  selector: 'app-player-stats-header',

  standalone: true,

  imports: [CommonModule],
  templateUrl: './player-stats-header.component.html',

  styleUrls: ['./player-stats-header.component.scss']

})

export class PlayerStatsHeaderComponent {

  @Input() profile!:Profile;

  protected basedUrl:string = environment.basedUrl;

  constructor(private navigation: CurrentPageService) { }

  navigateBack() { this.navigation.adminNav('selection-stat-acceuilli') }

  getProfile(){ return this.profile }


  getInitials(): string {

    if (!this.profile) {
      console.error("Error - Profile not found"); 
      return '';
    }

    const firstName = this.profile.name.charAt(0).toUpperCase();
    const lastName = this.profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }


}
