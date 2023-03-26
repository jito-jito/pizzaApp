import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs  } from "firebase/firestore";
import { FirebaseMainService } from './main';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDbService {
  db: any

  constructor(  
    private _firebaseMain : FirebaseMainService
  ) { 
    this._firebaseMain.firebaseInit()
    this.db = getFirestore(this._firebaseMain.app);
  }
  
  async createUser(uid: string, email: string, alias: string, role: string) {
    try {
      const docRef = await addDoc(collection(this.db, "users"), {
        alias,
        email,
        role,
        uid
      });

      return {
        status: 'ok',
        docRef: docRef.id,
        userData: {
          alias,
          email,
          role,
          uid
        }
      }
    } catch (err) {
      // console.error("Error adding document: ");
      throw ({
        status: 'error',
        code: 500,
        message: err
      })
    }
  }

  async getUser(uid: string) {
    try {
      const docsRef = collection(this.db, "users");
      const q = query(docsRef, where("uid", "==", uid));
  
      const querySnapshot = await getDocs(q);
  
      let results: any = []
      querySnapshot.forEach((doc: any) => {
        results.push(doc.data())
      });
  
      return {
        status: 'ok',
        userData: {
          ...results[0]
        }
          
      }
    } catch (error) {
      throw ({
        status: 'error',
        code: 500,
        message: error
      })
    }
   
  }
}





