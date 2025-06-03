import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerGameLoginPageComponent } from './multiplayer-game-login-page.component';

describe('MultiplayerGameLoginPageComponent', () => {
  let component: MultiplayerGameLoginPageComponent;
  let fixture: ComponentFixture<MultiplayerGameLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiplayerGameLoginPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplayerGameLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
