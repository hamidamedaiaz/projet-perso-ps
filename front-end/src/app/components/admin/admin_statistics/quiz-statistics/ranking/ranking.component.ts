import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rank } from 'src/models/rank.model';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit{



  @Input() rank: Rank[] = []

  constructor() { }

  ngOnInit() { this.rank.sort((a, b) => b.score - a.score); }

  getRank() { return this.rank; }

}
