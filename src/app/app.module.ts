import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';

/**
 * ui
 */

import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MainComponent } from './main/main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { UserComponent } from './user/user.component';
import { Code404Component } from './code404/code404.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatExpansionModule } from '@angular/material/expansion';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    UserComponent,
    Code404Component,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    /** ui */
    MatGridListModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
