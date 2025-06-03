import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizScoreboardComponent } from './quiz-scoreboard.component';

describe('QuizScoreboardComponent', () => {
  let component: QuizScoreboardComponent;
  let fixture: ComponentFixture<QuizScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizScoreboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
