import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GamemodeComponent } from './components/game/gamemodes/gamemode/gamemode.component';
import { GamemodeListComponent } from './components/game/gamemodes/gamemode-list/gamemode-list.component';
import { GamemodeSelectionComponent } from './pages/game/gamemode-selection-page/gamemode-selection-page.component';
import {FormsModule } from "@angular/forms";
import {PopupComponent} from "./components/popup/popup.component";


@NgModule({
  declarations: [
    AppComponent,
    GamemodeComponent,
    GamemodeListComponent,
    GamemodeSelectionComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        PopupComponent
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
