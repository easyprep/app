import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private auth: AngularFireAuth) {
    auth.authState.subscribe((u) => {
      if (u) {
        this.user.next({
          id: u.uid,
          name: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
          lastSignInTime: u.metadata.lastSignInTime,
        });
      } else {
        this.user.next(null);
      }
    });
  }

  signin() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signout() {
    this.auth.signOut();
  }
}
