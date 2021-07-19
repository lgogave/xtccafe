import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { User } from '../salespipeline/salespipeline.model';
import { ClientUser, ClientUserAccess } from '../models/client-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _appuser:User = new User(null,null,null,null,null);
  constructor(private firebaseService:AngularFirestore) { }
  async getusers(){
    const users = await this.firebaseService.collection('user-roles')
    .valueChanges().pipe(first()).toPromise();
     return users as User[];
  }
  async getclientusers(){
    const users = await this.firebaseService.collection('client-user-access')
    .valueChanges().pipe(first()).toPromise();
     return users as ClientUserAccess[];
  }

  async addclientUser(clientUser:ClientUserAccess){
     await this.firebaseService.collection('client-user-access').add(Object.assign({}, clientUser)).then((doc)=>doc);
  }

  async deleteclientUser(clientUser:ClientUserAccess){
    var users=await this.firebaseService
    .collection('client-user-access',ref=>ref
    .where("clientId","==",clientUser.clientId)
    .where("userId","==",clientUser.userId)
    )
    .get();
    users.forEach(docs => {
      docs.forEach(doc=>{
        this.firebaseService
        .collection('client-user-access').doc(doc.id).delete();
      })
    });
  }

  get deviceToken(){
    return this._appuser.deviceToken;
  }
  setdeviceToken(token){
    this._appuser.deviceToken=token;
  }

}
