import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Profile } from "src/models/profile.model";
import { ADMIN_PROFILE, GUEST_PROFILE } from "../mocks/profile-list.mock";
import { LocalStorageService } from "./localstorage.service";
import { SocketService } from "./socket.service";

@Injectable({
    providedIn: 'root'
})

export class CurrentProfileService {


    private current_profile: Profile = GUEST_PROFILE

    public current_profile$: BehaviorSubject<Profile> = new BehaviorSubject<Profile>(this.current_profile);

    private CURRENT_PROFILE_KEY: string = "CURRENT_PROFILE";

    constructor(private localStorageService: LocalStorageService, private socketService: SocketService) {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        this.current_profile = this.localStorageService.getItem(this.CURRENT_PROFILE_KEY);
        this.current_profile$.next(this.current_profile);
    }

    setCurrentProfile(profile: Profile) {
        this.current_profile = profile;
        this.current_profile$.next(this.current_profile);
        this.localStorageService.storeItem(this.CURRENT_PROFILE_KEY, JSON.stringify(this.current_profile));
    }

    getCurrentProfile() { return this.current_profile; }

    resetCurrentProfile() {
        console.log("Current Profile has been reset successfully");
        this.socketService.emit("lobby-disconnect", this.current_profile);
        this.current_profile = GUEST_PROFILE;
        this.current_profile$.next(this.current_profile)

        this.localStorageService.removeItem(this.CURRENT_PROFILE_KEY);
        this.localStorageService.storeItem(this.CURRENT_PROFILE_KEY, JSON.stringify(this.current_profile))
    }

    public setAdmin() {
        this.current_profile = ADMIN_PROFILE;
        this.current_profile$.next(this.current_profile);
        this.localStorageService.storeItem(this.CURRENT_PROFILE_KEY, JSON.stringify(this.current_profile));
    }
}
