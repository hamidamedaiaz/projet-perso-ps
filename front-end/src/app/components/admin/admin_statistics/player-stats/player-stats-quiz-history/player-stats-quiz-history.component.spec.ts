import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerStatsQuizHistoryComponent } from './player-stats-quiz-history.component';

describe('PlayerStatsQuizHistoryComponent', () => {
  let component: PlayerStatsQuizHistoryComponent;
  let fixture: ComponentFixture<PlayerStatsQuizHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerStatsQuizHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerStatsQuizHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
