import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Client } from './client.model';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

interface ClientData{
  name: string,
  type: string,
  contactPerson: string,
  contactNumber: number,
  email: string,
  potentialNature: string,
  accountOwner: string,
  userId:string
}


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private _clients = new BehaviorSubject<Client[]>([]);
  constructor(private authService: AuthService, private http: HttpClient,private firebaseService:AngularFirestore) { }

  get clients(){
    return this._clients.asObservable();
  }

  getClient(id: string) {
    return this.authService.token.pipe(take(1),
      switchMap((token) => {
       return this.firebaseService.collection('clients').doc<Client>(id).valueChanges();
      }),
      map((resData) => {
        return new Client(
          id,
          resData.name,
          resData.type,
          resData.contactPerson,
          resData.contactNumber,
          resData.email,
          resData.potentialNature,
          resData.accountOwner,
          resData.userId
        );
      })
    );
  }

  fetchClients() {
    let fetchedUserId:string;
    return this.authService.userId.pipe(take(1),switchMap(userId=>{
      if(!userId){
        throw new Error('User not found!')
      }
      fetchedUserId=userId;
      return this.authService.token;
    }),
    take(1),
      switchMap((token) => {
        return this.firebaseService.collection('clients',ref=>ref.where('userId','==',fetchedUserId)).snapshotChanges().pipe(
        map(clients=> {
        return clients.map(client=>{
          var cl= <Client>{...client.payload.doc.data() as {}};
          cl.id=client.payload.doc.id;
          return cl;
          });
          })
        );
        }),
       tap((clients) => {
        this._clients.next(clients);
      })
    );
  }
  addClient(
    name: string,
    type: string,
    contactPerson: string,
    contactNumber: number,
    email: string,
    potentialNature: string,
    accountOwner: string
  ) {
    let generatedId: string;
    let newClient: Client;
    let fetchedUserId:string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error("No User Id Found!");
        }
        newClient = new Client(
          Math.random().toString(),
          name,
          type,
          contactPerson,
          contactNumber,
          email,
          potentialNature,
          accountOwner,
          fetchedUserId
        );
        return this.firebaseService.collection('clients').add(Object.assign({}, newClient));
      }),
      switchMap(client=>{
      return client.id;
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData;
        return this.clients;
      }),
      take(1),
      tap((clients) => {
        newClient.id = generatedId;
        this._clients.next(clients.concat(newClient));
      })
    );
  }

  editClient(clientId: string, name: string, type: string, contactPerson: string, contactNumber: number, email: string, potentialNature: string, accountOwner: string) {
    let updatedClients: Client[];
    let fetchedToken:string;
    return this.authService.token.pipe(take(1),switchMap(token=>{
      fetchedToken=token;
      return this.clients;
    }),
      take(1),
      switchMap((clients) => {
        if (!clients || clients.length <= 0) {
          return this.fetchClients();
        } else {
          return of(clients);
        }
      }),
      switchMap((clients) => {
        const updatedClientIndex = clients.findIndex((pl) => pl.id === clientId);
        updatedClients = [...clients];
        const oldClient = updatedClients[updatedClientIndex];
        updatedClients[updatedClientIndex] = new Client(
          clientId,
          name,
          type,
          contactPerson,
          contactNumber,
          email,
          potentialNature,
          accountOwner,
          oldClient.userId
        );
        return this.firebaseService.collection('clients').doc(clientId).update(Object.assign({}, updatedClients[updatedClientIndex]));
      }),
      take(1),
      tap(() => {
        this._clients.next(updatedClients);
      })
    );
  }

  deleteClient(clientId:string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('clients')
          .doc(clientId)
          .delete();
      }),
      take(1),
      switchMap(() => {
        return this.clients;
      }),
      take(1),
      tap((clients) => {
        this._clients.next(clients.filter((b) => b.id !== clientId));
      })
    );
  }

}
