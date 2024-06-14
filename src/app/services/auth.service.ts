import { Injectable, NgZone } from '@angular/core';
import { User } from './user';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning) {
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      console.log("user subscribed");
      console.log(user);
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        this.router.navigate(['/dashboard'])
        .then(nav => {
          console.log(nav); // true if navigation is successful
        }, err => {
          console.log(err) // when there's an error
        });
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    console.log("signIn");
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      });
      // .catch((error) => {
      //   // console.log(error);
      //   // return error;
      //   // window.alert(error.message);
      //   // return {
      //   //   result: false,
      //   //   message: error.message
      //   // }
      // });
  }

  // Sign up with email/password
  signUp(email: string, password: string) {
    console.log("signUp");
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.sendVerificationMail();
        this.setUserData(result.user);
      });
      // .catch((error) => {
      //   window.alert(error.message);
      // });
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    console.log("sendVerificationMail");
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail: string) {
    console.log("forgotPassword");
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    console.log("setUserData");
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Auth logic to run auth providers
  authLogin(provider: any) {
    console.log("authLogin");
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.setUserData(result.user);
        // this.router.navigate(['/dashboard'])
        // .then(nav => {
        //   console.log(nav); // true if navigation is successful
        // }, err => {
        //   console.log(err) // when there's an error
        // });
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Sign in with Google
  googleAuth() {
    console.log("googleAuth");
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  // Sign out
  signOut() {
    console.log("signOut");
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

}
