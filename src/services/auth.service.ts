import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {

  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth){
    this.afAuth.authState.subscribe(user => {
        console.log('Paso auth', user);
        this.user = user;
      });
  }

  signInWithEmail(credentials){
    console.log('Acceder con email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
  signUp(credentials){
    console.log('Registrarse con email');
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  getAuthenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  getUserUid(){
    return this.user && this.user.uid;
  }

  /*
  signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
      .then(() => {
        return this.afAuth.auth.getRedirectResult().then( result => {
          // This gives you a Google Access Token.
          // You can use it to access the Google API.
          let token = result.credential.accessToken;
          // The signed-in user info.
          let user = result.user;
          console.log(token, user);
        }).catch(function(error) {
          // Handle Errors here.
          alert(error.message);
        });
      });
    }
  }
  */


}