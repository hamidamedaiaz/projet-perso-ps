import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSubmittedPageComponent } from './answer-submitted-page.component';

describe('AnswerSubmittedPageComponent', () => {
  let component: AnswerSubmittedPageComponent;
  let fixture: ComponentFixture<AnswerSubmittedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerSubmittedPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerSubmittedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
