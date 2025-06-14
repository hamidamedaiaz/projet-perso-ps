import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-session-result-header',
  standalone: true,
  imports: [],
  templateUrl: './session-result-header.component.html',
  styleUrl: './session-result-header.component.scss'
})
export class SessionResultHeaderComponent {

  @Output()
  public go_back:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(){}

  public navigateBack(){
    this.go_back.emit(true);
  }


}
