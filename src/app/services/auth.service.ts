import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );
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
}
