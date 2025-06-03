import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingStartPageComponent } from './waiting-start-page.component';

describe('WaitingStartPageComponent', () => {
  let component: WaitingStartPageComponent;
  let fixture: ComponentFixture<WaitingStartPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingStartPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaitingStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
