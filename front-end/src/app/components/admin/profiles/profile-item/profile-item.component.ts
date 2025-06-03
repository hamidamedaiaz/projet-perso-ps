import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Profile } from 'src/models/profile.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/services/currentPage.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrl: './profile-item.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class ProfileItemComponent {

  currentPage: String = this.currentPageService.getCurrentPage();

  @Input()
  profile: Profile | undefined;

  @Input()
  context: string = '';

  @Output()
  profileSelected: EventEmitter<Profile> = new EventEmitter<Profile>();

  @Output()
  delete_profile: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private currentPageService: CurrentPageService,
    private currentProfileService:CurrentProfileService
  ) { }

  selectProfile() {
    if (this.profile) {
      if (this.currentPage === 'home') {

        this.profileSelected.emit(this.profile);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/gamemode-selection']);
        }, 100);
      }
      else if(this.currentPage==='admin'){
        this.profileSelected.emit(this.profile);
        this.cdr.detectChanges();
      }
      else if(this.currentPage === 'multiplayer-setup'){
        console.log("remove ", this.profile)
        this.profileSelected.emit(this.profile);
      }
    }
  }

  deletePlayer(){
    this.delete_profile.emit(true);
  }

  public getRole(){
    return this.currentProfileService.getCurrentProfile().name;
  }

  public getInitials(): string {
    if (!this.profile) return '';

    const firstName = this.profile.name.charAt(0).toUpperCase();
    const lastName = this.profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }
}
