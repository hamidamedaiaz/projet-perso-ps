import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResultQuestionsComponent } from './session-result-questions.component';

describe('SessionResultQuestionsComponent', () => {
  let component: SessionResultQuestionsComponent;
  let fixture: ComponentFixture<SessionResultQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionResultQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionResultQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
