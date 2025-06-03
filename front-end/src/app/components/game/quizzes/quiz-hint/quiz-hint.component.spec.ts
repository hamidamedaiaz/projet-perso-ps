import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHintComponent } from './quiz-hint.component';

describe('QuizHintComponent', () => {
  let component: QuizHintComponent;
  let fixture: ComponentFixture<QuizHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
