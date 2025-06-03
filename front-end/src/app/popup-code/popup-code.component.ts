import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { CurrentPageService } from 'src/services/currentPage.service';
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-code',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule],
  templateUrl: './popup-code.component.html',
  styleUrl: './popup-code.component.scss'
})
export class PopUpCodeComponent {

  @Input()
  show: boolean = false;

  @Output()
  close: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  success: EventEmitter<boolean> = new EventEmitter<boolean>();


  public hide: boolean = true;
  public codeError: boolean = false;
  public CORRECT_CODE: string = "1234";
  public code: string[] = ['', '', '', ''];
  private autoCloseTimeoutId: any = null;

  constructor(private currentPageService: CurrentPageService, private currentProfileService: CurrentProfileService, private router: Router) { }

  reset() {
    this.show = false;
    // Si un timer précédent existe, on l’annule
    if (this.autoCloseTimeoutId) {
      clearTimeout(this.autoCloseTimeoutId);
    }
    this.autoCloseTimeoutId = setTimeout(() => {
      this.show = true;
      this.code = ['', '', '', ''];
      this.codeError = false;
      this.autoCloseTimeoutId = null; // Réinitialise l’ID
    }, 10000);
  }

  closePopup() {
    this.hide = true; // Cache la popup si on clique en dehors
    if (this.autoCloseTimeoutId) {
      clearTimeout(this.autoCloseTimeoutId);
      this.autoCloseTimeoutId = null;
    }
    this.show = true;
    this.code = ['', '', '', ''];
    this.codeError = false;
    this.autoCloseTimeoutId = null; // Réinitialise l’ID
    this.close.emit(true)
  }

  onInput(index: number, event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Autoriser uniquement les chiffres
    if (!/^\d$/.test(value)) {
      input.value = '';
      this.code[index] = '';
      return;
    }

    this.code[index] = value;

    // Aller au champ suivant si un chiffre est saisi
    if (index < 3) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Vérification si tous les chiffres sont remplis
    if (this.code.every(digit => digit !== '')) {
      const finalCode = this.code.join('');
      console.log("Code saisi :", finalCode);
      if (finalCode === this.CORRECT_CODE) {
        this.success.emit(true)
      }
      else {
        this.codeError = true;
        this.code = ['', '', '', ''];
        // Vider les champs visibles normalement le this.Code = ... marche mais l'affichage bug ça va trop vite
        const inputs = document.querySelectorAll('.code-inputs input') as NodeListOf<HTMLInputElement>;
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
      }
    }
  }



  keyPressed(i: number, event: KeyboardEvent) {
    console.log("keyPressed" + event.key);
    const inputs = document.querySelectorAll('.code-inputs input') as NodeListOf<HTMLInputElement>;

    if (event.key === 'Backspace') {
      this.code[i] = '';
      if (i > 0) {
        inputs[i - 1].focus();
      }
      event.preventDefault();
    }
  }
}
