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
      if (this.currentProfileCopy) {
        this.currentProfileCopy.profilePicture = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

public getAvatarPreviewStyle() {
  return this.avatarPreview ? `url(${this.avatarPreview})` : 'none';
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profile'] && changes['profile'].currentValue) {
      console.log('Profile configuration changed to:', this.currentProfileCopy?.name);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  //resetEmptyProfile():void{ this.profileTemplate = JSON.parse(JSON.stringify("j")); }

  closeConfiguration() {
    console.log('Fermeture du panneau de configuration');
    this.closeConfigPanel.emit();
  }

  saveConfiguration() {
    this.profileService.updateProfile(this.currentProfileCopy!);
    this.closeConfiguration();
  }
}
