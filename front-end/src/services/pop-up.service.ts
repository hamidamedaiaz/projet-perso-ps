import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Popup } from "../models/popup.model";

@Injectable({
  providedIn: 'root'
})

export class PopUpService {

  constructor() { }

  public popup$ = new BehaviorSubject<Popup | null>(null);

  sendPopup(pop: Popup) { this.popup$.next(pop); }
}
