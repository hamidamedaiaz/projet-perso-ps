import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { GamemodeService } from 'src/services/gamemode.service';

@Component({
  selector: 'app-music-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-control.component.html',
  styleUrl: './music-control.component.scss'
})
export class MusicControlComponent implements AfterViewInit {
  @Input()
  volume: number = 50; // Default volume

  @Input()
  role:String = "User";
  
  @Input()
  audio_path!: string;
  
  @Output()
  restart_music: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @Output()
  decrease_volume: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @Output()
  increase_volume: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  private audioElement!: HTMLAudioElement;
  
  constructor(
    private gamemodeService: GamemodeService,
    private currentProfileService: CurrentProfileService
  ) {}

  ngAfterViewInit() {
    // Get audio element
    this.audioElement = document.getElementById('audio') as HTMLAudioElement;
    
    if (this.audioElement) {
      // Set initial volume
      this.audioElement.volume = this.volume / 100;
      
      // Set up play button
      const playBtn = document.getElementById('play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', () => this.playMusic());
      }
      
      // Set up pause button
      const pauseBtn = document.getElementById('pause-btn');
      if (pauseBtn) {
        pauseBtn.addEventListener('click', () => this.pauseMusic());
      }
    }
  }

  public playMusic() {
    if (this.audioElement) {
      this.audioElement.play();
      console.log("Playing music...");
    }
  }

  public pauseMusic() {
    if (this.audioElement) {
      this.audioElement.pause();
      console.log("Pausing music...");
    }
  }

  public restartMusic() {
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
      console.log("Restarting the music...");
      this.restart_music.emit(true);
    }
  }

  public setVolume(newVolume: number) {
    this.volume = newVolume;
    if (this.audioElement) {
      this.audioElement.volume = this.volume / 100;
    }
  }

  public getVolume() {
    return this.volume;
  }

  public increaseVolume() {
    if (this.volume < 100) {
      this.volume += 10;
      if (this.audioElement) {
        this.audioElement.volume = this.volume / 100;
      }
      console.log("Increasing the volume to", this.volume);
      this.increase_volume.emit(true);
    }
  }

  public decreaseVolume() {
    if (this.volume > 0) {
      this.volume -= 10;
      if (this.audioElement) {
        this.audioElement.volume = this.volume / 100;
      }
      console.log("Decreasing the volume to", this.volume);
      this.decrease_volume.emit(true);
    }
  }

  public getGamemode() {
    return this.gamemodeService.getCurrentGamemode();
  }

  public getRole() {
    return this.currentProfileService.getCurrentProfile().role;
  }
}