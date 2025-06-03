import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerGameSetupSidebarComponent } from './multiplayer-game-setup-sidebar.component';

describe('MultiplayerGameSetupSidebarComponent', () => {
  let component: MultiplayerGameSetupSidebarComponent;
  let fixture: ComponentFixture<MultiplayerGameSetupSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiplayerGameSetupSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplayerGameSetupSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
