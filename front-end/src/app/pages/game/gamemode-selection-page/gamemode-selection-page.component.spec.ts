import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodeSelectionPageComponent } from './gamemode-selection-page.component';

describe('GamemodeSelectionPageComponent', () => {
  let component: GamemodeSelectionPageComponent;
  let fixture: ComponentFixture<GamemodeSelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamemodeSelectionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamemodeSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
