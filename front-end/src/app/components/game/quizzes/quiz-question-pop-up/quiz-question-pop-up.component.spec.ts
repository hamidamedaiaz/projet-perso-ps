import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizQuestionPopUpComponent } from './quiz-question-pop-up.component';

describe('QuizQuestionPopUpComponent', () => {
  let component: QuizQuestionPopUpComponent;
  let fixture: ComponentFixture<QuizQuestionPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizQuestionPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizQuestionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
