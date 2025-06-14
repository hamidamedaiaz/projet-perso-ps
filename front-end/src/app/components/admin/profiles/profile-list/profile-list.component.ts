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
import { FileUploadService } from "../../../../../services/file-upload.service";
import { SessionService } from 'src/services/session.service';
import { Player } from 'src/models/player.model';
import { StatsService } from 'src/services/stats.service';

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

  public players: Player[] = [];

  // Stocker l'image en tant que fichier
  public selectedAvatarFile: File | null = null;



  constructor(
    public profileService: ProfileService,
    private currentProfileService: CurrentProfileService,
    private cdr: ChangeDetectorRef,
    private currentPageService: CurrentPageService,
    private socketService: SocketService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private sessionService: SessionService, private statsService:StatsService) {
    this.profileService.profiles$.subscribe((profiles) => {
      this.profileList = profiles;
    });

    this.profileService.profileToEdit$.subscribe((profile) => {
      this.currentProfile = profile;
    })

    this.sessionService.players$.subscribe((players) => this.players = players)
  }

  filteredProfiles() {
    return this.profileList.filter(profile =>
      profile.name.toLowerCase().concat(' ').concat(profile.lastName.toLowerCase()).includes(this.searchQuery.toLowerCase())
    );
  }

  public kickPlayer(player: Player) {
    const sessionId: string = this.sessionService.getSessionId();
    this.socketService.emit("kick-player", { profile: player.profile, sessionId: sessionId });
    this.sessionService.removePlayerById(sessionId, player.profile.id)
  }

  public filteredSessionProfiles() {
    return this.players
  }

  profileSelectedHandler(profile: Profile) {
    setTimeout(() => {
      if (this.context === 'home') {
        this.currentProfileService.setCurrentProfile(profile);
        setTimeout(() => {
          this.router.navigate(['/gamemode-selection']);
        }, 100);
        this.socketService.emit("lobby-connection", profile)
      } else if (this.context === 'profile-gestion') {
        this.profileService.selectProfileForEdition(profile);
        this.profileSelected.emit(profile);
      } else if (this.context === 'accueillis-stats'){
        this.profileSelected.emit(profile);
      }
      else {
        this.profileSelected.emit(profile);
        this.statsService.selectProfile(profile.id);
      }
      this.cdr.detectChanges();
    }, 0);
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
      NUMBER_OF_WRONG_ANSWERS_DISPLAYED: 4,
      SHOW_HINT_TIMER: 5,
      NUMBER_OF_HINTS_DISPLAYED: 4,
      FONT_SIZE:1,
      profilePicture: "empty_path"
    };
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

    if (this.isEditing) {
      this.profileService.updateProfile(this.currentProfile);
    }

    else {

      if (this.selectedAvatarFile != null) {

        this.fileUploadService.upload(this.selectedAvatarFile).subscribe({
          next: (res) => {
            console.log('Upload réussi :', res);
            this.currentProfile.profilePicture = res.filename;

            this.profileService.createProfile(
              this.currentProfile.name,
              this.currentProfile.lastName,
              this.currentProfile.profilePicture
            );
            this.cancelProfileForm();

          },
          error: (err) => {
            console.error('Erreur pendant upload :', err);
            this.currentProfile.profilePicture = 'empty_path';
            this.cancelProfileForm();
          }
        });

      }
    }
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
      NUMBER_OF_WRONG_ANSWERS_DISPLAYED: 4,
      NUMBER_OF_HINTS_DISPLAYED: 4,
      FONT_SIZE:1,
      profilePicture: "empty_path"
    };
  }


  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAvatarFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedAvatarFile);
    }
  }


  public getAvatarPreviewStyle() {
    return this.avatarPreview ? `url(${this.avatarPreview})` : 'none';
  }

}
