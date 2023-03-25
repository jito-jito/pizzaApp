import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,updateProfile } from "firebase/auth";
import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { FirebaseMainService } from "./main";


@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  // auth 
  private auth

  userSession = new Subject()
  $userSession = this.userSession.asObservable()

  constructor(
    private _firebaseMain : FirebaseMainService
  ) { 
    this._firebaseMain.firebaseInit()
    this.auth = getAuth();

    onAuthStateChanged(this.auth, (userLogged) => {
      if (userLogged) {
        // Has user logged
        this.userSession.next({
            providerData: userLogged.providerData,
            uid: userLogged.uid
        })
      } else {
        // User is signed out
        this.userSession.next(null)
      }
    });
  }

  registerUser(email: string, password: string) {
    return new Observable((subscriber) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          subscriber.next({
            status: 'ok',
            providerData: user.providerData,
            uid: user.uid
          })
          subscriber.complete()
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message

          subscriber.error({
            status: 'error',
            errorCode,
            errorMessage
          })
        })
    })
  }

  loginUser(email: string, password: string) {
    return new Observable((subscriber) => {
      signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        
        subscriber.next({
          status: 'ok',
          providerData: user.providerData,
          uid: user.uid
        })
        subscriber.complete()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        subscriber.error({
          status: 'error',
          errorCode,
          errorMessage
        })
      });
    })
  }

  updateUserData(Name: string) {
    // updateProfile(this.auth.currentUser, {
    //   displayName: Name
    // }).then(() => {
    //   // Profile updated!
    //   // ...
    // }).catch((error) => {
    //   // An error occurred
    //   // ...
    // });
  }

  logoutUser() {
    return new Observable((subscriber) => {
      signOut(this.auth).then(() => {
        // Sign-out successful.
        console.log('user logout')
        subscriber.next({
          status: 'ok'
        })
        subscriber.complete()
      }).catch((error) => {
        subscriber.next({
          status: 'error',
          error: error
        })
      });
    })
  }
  
}