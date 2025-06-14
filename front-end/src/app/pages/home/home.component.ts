import { Component, Input } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ProfileListComponent } from 'src/app/components/admin/profiles/profile-list/profile-list.component';
import { CurrentPageService } from 'src/services/currentPage.service';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { CurrentProfileService } from 'src/services/currentProfile.service';
import { PopUpCodeComponent } from 'src/app/popup-code/popup-code.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ProfileListComponent,
    NgClass,
    NgIf,
    PopUpCodeComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  constructor(private router: Router,
    private currentPageService: CurrentPageService,
    private currentProfileService: CurrentProfileService) {
    this.currentPageService.setCurrentPage("home");
  }

  public popUp: boolean = false;

  @Input()
  public context: string = "home";

  closePopUp() {
    this.popUp = false;
  }

  public showPopUp() {
    this.popUp = true;
  }

  public goToAdminPanel() {
    this.currentPageService.setCurrentPage("admin");
    this.currentProfileService.setAdmin();
    this.router.navigate(['/admin']);
  }

}
