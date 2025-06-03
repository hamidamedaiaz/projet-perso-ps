import {Component, NgModule, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { PopUpService } from 'src/services/pop-up.service';
import { Popup} from "../../../models/popup.model";
import { animate, style, transition, trigger } from '@angular/animations';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  popup: Popup | null = null;
  visible: boolean = false;

  constructor(private popupService: PopUpService) {}

  ngOnInit() {
    this.popupService.popup$.subscribe(val => {
      if (val != null) {
        this.popup = val;
        this.visible = true;

        setTimeout(() => {
          this.visible = false;
          this.popup = null;
        }, val.duration);
      }
    });
  }


  closePopup() {
    this.visible = false;
    this.popup = null;
  }

}
