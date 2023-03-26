import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,updateProfile } from "firebase/auth";
import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";
import { FirebaseMainService } from "./main";
import { FirebaseDbService } from "./db";


@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  // auth 
  private auth

  userSession = new Subject()
  $userSession = this.userSession.asObservable()

  constructor(
    private _firebaseMain : FirebaseMainService,
    private _firebaseDb : FirebaseDbService
  ) { 
    this._firebaseMain.firebaseInit()
    this.auth = getAuth();

    onAuthStateChanged(this.auth, async (userLogged) => {
      if (userLogged) {
        // Has user logged
        try {
          const dbResp = await this._firebaseDb.getUser(userLogged.uid)

          this.userSession.next({
              providerData: {...dbResp.userData},
              uid: dbResp.userData.uid
          })
        } catch (error: any) {
          throw ({
            ...error
          })
        }
   
      } else {
        // User is signed out
        this.userSession.next(null)
      }
    });
  }

  registerUser(email: string, password: string, role: string, alias: string) {
    return new Observable((subscriber) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          return this._firebaseDb.createUser(user.uid, email, alias, role)
        })
        .then((dbResp) => {

          subscriber.next({
            status: 'ok',
            providerData: {
              ...dbResp.userData
            }
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
        
        return this._firebaseDb.getUser(user.uid)
      })
      .then((dbResp) => {

        console.log(dbResp)
        subscriber.next({
          status: 'ok',
          providerData: {...dbResp.userData}
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