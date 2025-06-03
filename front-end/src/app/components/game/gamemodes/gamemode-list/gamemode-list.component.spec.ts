import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodeListComponent } from './gamemode-list.component';

describe('GamemodeListComponent', () => {
  let component: GamemodeListComponent;
  let fixture: ComponentFixture<GamemodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamemodeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamemodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
