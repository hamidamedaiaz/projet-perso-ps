import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionResultHeaderComponent } from './session-result-header.component';

describe('SessionResultHeaderComponent', () => {
  let component: SessionResultHeaderComponent;
  let fixture: ComponentFixture<SessionResultHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionResultHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionResultHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
