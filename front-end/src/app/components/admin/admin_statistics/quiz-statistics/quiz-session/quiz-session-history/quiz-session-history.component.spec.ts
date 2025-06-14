import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSessionHistoryComponent } from './quiz-session-history.component';

describe('QuizSessionHistoryComponent', () => {
  let component: QuizSessionHistoryComponent;
  let fixture: ComponentFixture<QuizSessionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizSessionHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizSessionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
