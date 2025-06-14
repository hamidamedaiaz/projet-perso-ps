import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Profile } from 'src/models/profile.model';
import {FormsModule} from "@angular/forms";
import { ProfileService } from 'src/services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-configuration',
  standalone: true,
  imports: [
    FormsModule,CommonModule
  ],
  templateUrl: './profile-configuration.component.html',
  styleUrl: './profile-configuration.component.scss'
})
export class ProfileConfigurationComponent implements OnChanges {

  @Output()
  closeConfigPanel = new EventEmitter<void>();

  //Copie Simple et efficace pour des types simples
  public currentProfileCopy: Profile | null = null;
  public avatarPreview: string | null = null;

  // Stocker l'image en tant que fichier
  public selectedAvatarFile: File | null = null;


  constructor(private cdr: ChangeDetectorRef, private profileService:ProfileService) {
    this.profileService.profileToEdit$.subscribe((profile) => {
      this.currentProfileCopy = JSON.parse(JSON.stringify(profile));

      if (profile.profilePicture && profile.profilePicture !== "empty_path") {
        this.avatarPreview = profile.profilePicture;
      } else {
        this.avatarPreview = null;
      }

    })


  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAvatarFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;

        if (this.currentProfileCopy) {
          this.currentProfileCopy.profilePicture = this.avatarPreview;
        }
      };
      reader.readAsDataURL(this.selectedAvatarFile);
    }
  }


  public getAvatarPreviewStyle() {
  return this.avatarPreview ? `url(http://localhost:9428/upload/${this.avatarPreview})` : 'none';
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profile'] && changes['profile'].currentValue) {
      console.log('Profile configuration changed to:', this.currentProfileCopy?.name);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  closeConfiguration() {
    console.log('Fermeture du panneau de configuration');
    this.closeConfigPanel.emit();
  }

  saveConfiguration() {
    console.log(this.currentProfileCopy)
    this.profileService.updateProfile(this.currentProfileCopy!);
    this.closeConfiguration();
  }
}
