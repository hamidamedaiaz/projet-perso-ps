import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCodeComponent } from './popup-code.component';

describe('PopupCodeComponent', () => {
  let component: PopUpCodeComponent;
  let fixture: ComponentFixture<PopUpCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
