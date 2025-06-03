import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleplayerGamePageComponent } from './singleplayer-game-page.component';

describe('SingleplayerPageComponent', () => {
  let component: SingleplayerGamePageComponent;
  let fixture: ComponentFixture<SingleplayerGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleplayerGamePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleplayerGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
