import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResultInfoComponent } from './session-result-info.component';

describe('SessionResultInfoComponent', () => {
  let component: SessionResultInfoComponent;
  let fixture: ComponentFixture<SessionResultInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionResultInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionResultInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
