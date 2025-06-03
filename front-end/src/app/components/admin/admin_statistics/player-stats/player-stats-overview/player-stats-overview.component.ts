import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({

  selector: 'app-player-stats-overview',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './player-stats-overview.component.html',

  styleUrls: ['./player-stats-overview.component.scss']
})

export class PlayerStatsOverviewComponent {

  @Input() totalGames: number = 0;
  @Input() bestScore: number = 0;
  @Input() averageScore: number = 0;

}