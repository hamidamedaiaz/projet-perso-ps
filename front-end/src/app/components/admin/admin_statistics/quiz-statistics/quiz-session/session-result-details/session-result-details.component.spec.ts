import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResultDetailsComponent } from './session-result-details.component';

describe('SessionResultDetailsComponent', () => {
  let component: SessionResultDetailsComponent;
  let fixture: ComponentFixture<SessionResultDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionResultDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionResultDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
