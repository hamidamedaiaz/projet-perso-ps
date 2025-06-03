import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Profile } from 'src/models/profile.model';
import { ProfileService } from 'src/services/profile.service';
import { ProfileItemComponent } from '../profile-item/profile-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { CurrentPageService } from 'src/services/currentPage.service';
import { GUEST_PROFILE } from 'src/mocks/profile-list.mock';
import { Router } from '@angular/router';
import { SocketService } from "../../../../../services/socket.service";

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
})

export class ProfileListComponent {
  public profileList: Profile[] = [];
  public isProfileListActivated: Boolean = false;
  public currentPage: String = this.currentPageService.getCurrentPage();

  @Output()
  profileSelected: EventEmitter<Profile> = new EventEmitter<Profile>();

  @Output()
  profileDeleted: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public searchQuery: String = '';

  @Input()
  public context: string = '';

  public avatarPreview: string | null = null;

  public showProfileForm: boolean = false;
  public isEditing: boolean = false;
  public currentProfile: Profile = GUEST_PROFILE;
  public showDeleteConfirm: boolean = false;
  public profileToDelete: Profile | null = null;

  constructor(
    public profileService: ProfileService,
    private currentProfileService: CurrentProfileService,
    private cdr: ChangeDetectorRef,
    private currentPageService: CurrentPageService,
    private socketService: SocketService,
    private router: Router) {
    this.profileService.profiles$.subscribe((profiles) => {
      this.profileList = profiles;
      console.log("Liste de profils mise à jour:", this.profileList.length, "profils");
    });

    this.profileService.profileToEdit$.subscribe((profile) => {
      this.currentProfile = profile;
    })
  }

  filteredProfiles() {
    return this.profileList.filter(profile =>
      profile.name.toLowerCase().concat(' ').concat(profile.lastName.toLowerCase()).includes(this.searchQuery.toLowerCase())
    );
  }

  profileSelectedHandler(profile: Profile) {
    console.log("Profil sélectionné dans contexte:", this.context, profile.name);

    setTimeout(() => {
      if (this.context === 'home') {
        this.currentProfileService.setCurrentProfile(profile);
        setTimeout(() => {
          this.router.navigate(['/gamemode-selection']);
        }, 100);

        this.socketService.emit("lobby-connection", profile)
        
      } else if (this.context === 'admin') {
        this.profileService.selectProfileForEdition(profile);
        this.profileSelected.emit(profile);
        console.log("Événement profileSelected émis pour:", profile.name);
      } else {

        this.profileSelected.emit(profile);
        console.log("Événement profileSelected émis pour:", profile.name);
      }
      this.cdr.detectChanges();
    }, 0);
  }


  public removeProfile(profileToRemove: Profile) {
    this.profileList = this.profileList.filter(profile => profile != profileToRemove);
  }


  public createProfile() {
    this.isEditing = false;
    this.avatarPreview = null;
    this.currentProfile = {
      id: Date.now(),
      name: '',
      lastName: '',
      role: 'user',
      SHOW_POP_UP_TIMER: 15000,
      REMOVE_WRONG_ANSWER_INTERVAL: 10000,
      NUMBER_OF_ANSWERS_DISPLAYED: 4,
      SHOW_HINT_TIMER: 5,
      NUMBER_OF_HINTS_DISPLAYED: 4,
      profilePicture: "empty_path"
    };
    this.showProfileForm = true;
  }

  public editProfile(profile: Profile) {
    this.isEditing = true;
    this.profileService.selectProfileForEdition(profile);
    this.showProfileForm = true;
  }

  public deleteProfile(profile: Profile) {
    this.profileToDelete = profile;
    this.showDeleteConfirm = true;
  }

  public confirmDelete() {
    if (this.profileToDelete) {
      this.profileService.deleteProfile(this.profileToDelete.id);
      this.showDeleteConfirm = false;
      this.profileToDelete = null;
      this.profileDeleted.emit(true)
    }
  }

  public cancelDelete() {
    this.showDeleteConfirm = false;
    this.profileToDelete = null;
  }

  getInitials(profile: Profile): string {
    if (!profile) return '';

    const firstName = profile.name.charAt(0).toUpperCase();
    const lastName = profile.lastName.charAt(0).toUpperCase();

    return firstName + lastName;
  }

  public saveProfile() {
    console.log('Enregistrement du profil avec image:',
      this.currentProfile.profilePicture !== 'empty_path' ? 'Image présente ' : 'Pas dimage',
      'Type:', typeof this.currentProfile.profilePicture);

    if (this.isEditing) {
      this.profileService.updateProfile(this.currentProfile);
    } else {
      if (!this.currentProfile.profilePicture || this.currentProfile.profilePicture === '') {
        this.currentProfile.profilePicture = 'empty_path';
      }

      this.profileService.createProfile(
        this.currentProfile.name,
        this.currentProfile.lastName,
        this.currentProfile.profilePicture
      );
    }
    this.cancelProfileForm();
  }

  public cancelProfileForm() {
    this.showProfileForm = false;
    this.avatarPreview = null;
    this.currentProfile = {
      id: 0,
      name: '',
      lastName: '',
      role: 'user',
      SHOW_POP_UP_TIMER: 15000,
      REMOVE_WRONG_ANSWER_INTERVAL: 10000,
      SHOW_HINT_TIMER: 5,
      NUMBER_OF_ANSWERS_DISPLAYED: 4,
      NUMBER_OF_HINTS_DISPLAYED: 4,
      profilePicture: "empty_path"
    };
  }
  public onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        console.error('Le fichier sélectionné n\'est pas une image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
        this.currentProfile.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  public getAvatarPreviewStyle() {
    return this.avatarPreview ? `url(${this.avatarPreview})` : 'none';
  }

}
