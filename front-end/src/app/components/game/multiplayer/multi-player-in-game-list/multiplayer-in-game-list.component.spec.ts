import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlayerInGameListComponent } from './multiplayer-in-game-list.component';

describe('MultiPlayerInGameListComponent', () => {
  let component: MultiPlayerInGameListComponent;
  let fixture: ComponentFixture<MultiPlayerInGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPlayerInGameListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiPlayerInGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
