import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rank } from 'src/models/rank.model';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {



  @Input()
  rank: Rank[] = []

  constructor() { }

  getRank() {
    return this.rank;
  }

}
