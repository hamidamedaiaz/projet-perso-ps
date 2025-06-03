import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPlayersListComponent } from './quiz-players-list.component';

describe('QuizPlayersListComponent', () => {
  let component: QuizPlayersListComponent;
  let fixture: ComponentFixture<QuizPlayersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPlayersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizPlayersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
