import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerGamePageComponent } from './multiplayer-game-page.component';

describe('MultiplayerGamePageComponent', () => {
  let component: MultiplayerGamePageComponent;
  let fixture: ComponentFixture<MultiplayerGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiplayerGamePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplayerGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
