import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

  
    constructor(){}

    public storeItem(key: string, value: string){
        localStorage.setItem(key,value);
    }

    public getItem(key:string){
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null;
    }

    public removeItem(key: string){
        localStorage.removeItem(key)
    }

    public clear(){
        localStorage.clear()
    }

}