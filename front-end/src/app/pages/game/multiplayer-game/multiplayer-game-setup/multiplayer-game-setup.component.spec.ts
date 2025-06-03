import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerGameSetupComponent } from './multiplayer-game-setup.component';

describe('MultiplayerGameSetupComponent', () => {
  let component: MultiplayerGameSetupComponent;
  let fixture: ComponentFixture<MultiplayerGameSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiplayerGameSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplayerGameSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
