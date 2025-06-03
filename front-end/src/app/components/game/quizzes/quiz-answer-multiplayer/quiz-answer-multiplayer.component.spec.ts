import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAnswerMultiplayerComponent } from './quiz-answer-multiplayer.component';

describe('QuizAnswerMultiplayerComponent', () => {
  let component: QuizAnswerMultiplayerComponent;
  let fixture: ComponentFixture<QuizAnswerMultiplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizAnswerMultiplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizAnswerMultiplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
