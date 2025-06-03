import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerProfileListComponent } from './multiplayer-profile-list.component';

describe('MultiplayerProfileListComponent', () => {
  let component: MultiplayerProfileListComponent;
  let fixture: ComponentFixture<MultiplayerProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiplayerProfileListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiplayerProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
