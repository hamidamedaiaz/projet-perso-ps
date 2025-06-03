import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CurrentPageService {


    private current_page: String = "home"
    public admin_navigation$ = new BehaviorSubject<string>("home");

    constructor() {}

    adminNav(page : string){
      this.admin_navigation$.next(page);
    }

    setCurrentPage(page: String) {
        this.current_page = page;
    }

    getCurrentPage(){
        return this.current_page;
    }

    resetCurrentPage(){
        console.log("Current Page has been reset to home successfully")
        this.current_page="home";
    }
}
