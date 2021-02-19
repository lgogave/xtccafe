import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Client } from './client.model';

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
  constructor(private authService: AuthService, private http: HttpClient) { }

  get clients(){
    return this._clients.asObservable();
  }

  getClient(id: string) {
    return this.authService.token.pipe(take(1),
      switchMap((token) => {
        return this.http.get<ClientData>(
          `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/clients/${id}.json?auth=${token}`
        );
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


        let url:string='';
        //temp
        if(fetchedUserId=="Wb5tr6u5oIeu966F1KtqS31qFTn2"){
          url= `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/clients.json?auth=${token}`
        }
        else{
          url=  `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/clients.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        }


        return this.http.get<{ [key: string]: ClientData }>(
         url
        );
      }),
      map((resData) => {
        const clients = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            clients.push(
              new Client(
                key,
                resData[key].name,
                resData[key].type,
                resData[key].contactPerson,
                resData[key].contactNumber,
                resData[key].email,
                resData[key].potentialNature,
                resData[key].accountOwner,
                resData[key].userId
              )
            );
          }
        }
        return clients;
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


        return this.http.post<{ name: string }>(
          `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/clients.json?auth=${token}`,
          { ...newClient, id: null }
        );
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
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
        return this.http.put<{ name: string }>(
          `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/clients/${clientId}.json?auth=${fetchedToken}`,
          { ...updatedClients[updatedClientIndex], id: null }
        );
      }),
      tap(() => {
        this._clients.next(updatedClients);
      })
    );
  }

  deleteClient(clientId:string) {
    return this.authService.token.pipe(take(1),switchMap(token=>{
      return this.http.delete(
        `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/clients/${clientId}.json?auth=${token}`
      )
    }),take(1),switchMap(()=>{
    return this.clients;
    }), take(1),tap(clients=>{
      this._clients.next(clients.filter(b=>b.id!==clientId));
    }));
  }

}
