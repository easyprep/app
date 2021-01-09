import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth) {
  }

  signin() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signout() {
    this.auth.signOut();
  }
}
