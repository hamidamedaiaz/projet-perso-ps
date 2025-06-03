import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHintsComponent } from './quiz-hints.component';

describe('QuizHintsComponent', () => {
  let component: QuizHintsComponent;
  let fixture: ComponentFixture<QuizHintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
