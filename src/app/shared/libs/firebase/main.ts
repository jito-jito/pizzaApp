import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FirebaseMainService {
  // For Firebase config credentials
  private firebaseConfig = {
    apiKey: environment.firebase_apiKey,
    authDomain: environment.firebase_authDomain,
    projectId: environment.firebase_projectId,
    storageBucket: environment.firebase_storageBucket,
    messagingSenderId: environment.firebase_messagingSenderId,
    appId: environment.firebase_appId,
    measurementId: environment.firebase_measurementId
  };

  app: any
  analytics: any

  constructor() { 
  }

  // Initialize Firebase and analytics
  firebaseInit() {
   this.app = initializeApp(this.firebaseConfig);
   this.analytics = getAnalytics(this.app);
  }
}





