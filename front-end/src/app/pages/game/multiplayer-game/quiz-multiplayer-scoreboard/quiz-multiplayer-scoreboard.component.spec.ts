import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMultiplayerScoreboardComponent } from './quiz-multiplayer-scoreboard.component';

describe('QuizMultiplayerScoreboardComponent', () => {
  let component: QuizMultiplayerScoreboardComponent;
  let fixture: ComponentFixture<QuizMultiplayerScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizMultiplayerScoreboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizMultiplayerScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
