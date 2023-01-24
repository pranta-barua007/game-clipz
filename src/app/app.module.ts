import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { UserModule } from './user/user.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipsListComponent } from './clips-list/clips-list.component';
import { FbTimestampPipe } from './pipes/fb-timestamp.pipe';

import { store } from './store/store';
import { StoreModule } from '@ngrx/store';
import { extModules } from './build-specifics';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    ClipComponent,
    NotFoundComponent,
    ClipsListComponent,
    FbTimestampPipe
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(store), 
    extModules,  // Instrumentation must be imported after importing StoreModule
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgOptimizedImage,
    UserModule,
    AppRoutingModule, //!important Always order for resolve routes properly,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
