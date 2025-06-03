import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuizPageComponent } from './select-quiz-page.component';

describe('SelectQuizPageComponent', () => {
  let component: SelectQuizPageComponent;
  let fixture: ComponentFixture<SelectQuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectQuizPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectQuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
