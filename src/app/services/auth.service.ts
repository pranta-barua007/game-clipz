import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';

import { delay, map, filter, switchMap } from 'rxjs/operators';

import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );

    // delay observeable to 1s to handle modal close
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );

    // extracting the router data from router observable
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(event => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(
      (data) => {
        this.redirect = data['authOnly'] ?? false
      }
    )
  }

  public async createUser(userData: IUser) {
    const {  
      name,
      email,
      age,
      phoneNumber,
      password 
    } = userData;
    
    if(!password) {
      throw new Error('Password not provided!')
    } 

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      email, 
      password
    );

    if(!userCredentials.user) {
      throw new Error("User can't be found")
    }

    await this.userCollection.doc(userCredentials.user.uid).set({
      name,
      email,
      age,
      phoneNumber
    });

    await userCredentials.user.updateProfile({
      displayName: name
    });
  }

  public async logout($event?: Event) {
    if($event) {
      $event.preventDefault();
    }

    await this.auth.signOut();

    if(this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
