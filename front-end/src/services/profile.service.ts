import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of } from "rxjs";
import { GUEST_PROFILE, PROFILE_LIST } from "../mocks/profile-list.mock";
import { Profile } from "src/models/profile.model";
import { LocalStorageService } from "./localstorage.service";
import { HttpClient } from '@angular/common/http';
//import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})

export class ProfileService {


  private profiles: Profile[] = [];

  private apiUrl = "http://localhost:9428/api/profiles";

  public profiles$: BehaviorSubject<Profile[]> = new BehaviorSubject<Profile[]>(this.profiles);

  public profileToEdit$: BehaviorSubject<Profile> = new BehaviorSubject<Profile>(PROFILE_LIST[0]);

  constructor(private http: HttpClient) {
    this.getProfileList();
  }



  public selectProfileForEdition(profileToEdit: Profile) {
    this.profileToEdit$.next(profileToEdit);
  }

  public getSelectedProfileForEdition() {
    if (this.profileToEdit$) return this.profileToEdit$;
    return null;
  }


  public async createProfile(
    name: string,
    lastName: string,
    profilePicture: string = "empty_path"
  ): Promise<void> {
    try {
      const newProfile: Profile = {
        id: this.generateNewId(),
        name,
        lastName,
        role: 'user',
        SHOW_POP_UP_TIMER: 15000,
        REMOVE_WRONG_ANSWER_INTERVAL: 10000,
        NUMBER_OF_ANSWERS_DISPLAYED: 4,
        SHOW_HINT_TIMER: 5000,
        NUMBER_OF_HINTS_DISPLAYED: 5,
        profilePicture: profilePicture
      };

      this.http.post(this.apiUrl, newProfile).subscribe({
        next: () => {
          console.log(`New profile created: ${name} ${lastName} with ID: ${newProfile.id}`);
          this.getProfileList();
        },
        error: (err) => {
          console.error('Failed to create profile', err);
        }
      });
    } catch (err) {
      console.error('Failed to create profile', err);
    }
  }


 getProfileList() {
  this.http.get<Profile[]>(this.apiUrl).subscribe((profilesList: Profile[]) => {
    this.profiles = profilesList;
    this.profiles.sort((a, b) => {
      const lastNameComparison = a.lastName.localeCompare(b.lastName);
      if (lastNameComparison === 0) {
        return a.name.localeCompare(b.name);
      }
      return lastNameComparison;
    });
    this.profiles$.next(this.profiles);
  });
}

getProfiles(profileIds: number[]): Profile[] {
    return this.profiles.filter(profile => profileIds.includes(profile.id));
}


// On return un Observable pour gérer le cas ou la base de donnée met du tps à retourner le profile
// Comme await/async
// Implique que l'on se subscribe à cette donnée pour obtenir ce contenu
  getProfile(profileId: number): Observable<Profile> {
    const url = this.apiUrl + "/" + profileId;
    return this.http.get<Profile>(url).pipe(
      catchError((err) => {
        console.log("Error - Something went wrong when trying to retrieve account ID:", profileId, err);
        return of(GUEST_PROFILE);
      })
    );
  }

  // getProfile(profileId:number):Profile{
  //   const profile = this.profiles.find((profile) => profile.id === profileId)
  //   if(profile)  return profile
  //   return GUEST_PROFILE;
  // }


  public deleteProfile(profileId: number): void {
    try {
      const url = this.apiUrl + "/" + profileId;
      console.log(url)
      this.http.delete<void>(url).subscribe({
        next: () => {

          this.getProfileList();
        },
        error: (err) => {
          console.error('Failed to delete profile', err);
        }
      });
    } catch (err) { console.error('Failed to delete profile', err); }
  }


  public updateProfile(updatedProfile: Profile): void {
    try {
      const index = this.profiles.findIndex(p => p.id === updatedProfile.id);
      this.http.put(this.apiUrl + "/" + updatedProfile.id, updatedProfile).subscribe({
        next: () => {
          if (index !== -1) {
            this.getProfileList();

            console.log(`Profile updated: ${updatedProfile.name} ${updatedProfile.lastName} with ID: ${updatedProfile.id}`);
          }
        },
        error: (err) => {
          console.log(`Failed to update profile with ID: ${updatedProfile.id} `, err);
        }
      });
    } catch (err) { console.log(`Failed to update profile with ID: ${updatedProfile.id} `, err); }

  }




  private generateNewId(): number {
    return this.profiles.length > 0
      ? Math.max(...this.profiles.map(profile => profile.id)) + 1
      : 1;
  }


}
