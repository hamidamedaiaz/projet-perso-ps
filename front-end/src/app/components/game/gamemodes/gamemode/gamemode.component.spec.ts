import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodeSelectionComponent } from 'src/app/pages/game/gamemode-selection-page/gamemode-selection-page.component';

describe('GamemodeSelectionComponent', () => {
  let component: GamemodeSelectionComponent;
  let fixture: ComponentFixture<GamemodeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamemodeSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamemodeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
