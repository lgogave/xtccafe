import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Client } from './client.model';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';

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
  providedIn: 'root',
})
export class ClientService {
  private _clients = new BehaviorSubject<Client[]>([]);
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private firebaseService: AngularFirestore,
  ) {}

  get clients() {
    return this._clients.asObservable();
  }

  getClient(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('clients')
          .doc<Client>(id)
          .valueChanges();
      }),
      map((resData) => {
        return new Client(
          id,
          resData.name,
          resData.contactPerson,
          resData.contactNumber,
          resData.email,
          resData.potentialNature,
          resData.accountOwner,
          resData.userId,
          resData.group,
          resData.gstNumber,
          resData.employeeStrength,
          resData.potentialNatureId,
          resData.country,
          resData.region,
          resData.subRegion,
          resData.state,
          resData.city,
          resData.locationId,
          resData.updatedOn,
          resData.divisionIds,
          resData.divisions,
          resData.clientTypeIds,
          resData.clientTypes,
          resData.id
        );
      })
    );
  }

  async getClientList_O(): Promise<any> {
    const userId = await this.authService.userId
      .pipe(
        take(1),
        map((userId) => {
          if (!userId) {
            throw new Error('User not found!');
          }
          return userId;
        })
      )
      .toPromise();
    const users = await this.firebaseService
      .collection('client-user-access', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(first())
      .toPromise();

    const clientList = await this.firebaseService
      .collection('clients', (ref) => ref.where('isActive', '==', true))
      .valueChanges()
      .pipe(first())
      .toPromise();
    let result = clientList as Client[];
    let clients: Client[] = [];
    result.forEach((client) => {
      if (
        users.filter((c) => c['clientId'] == client.id).length > 0 ||
        this.authService.isAdmin
      ) {
        clients.push(client);
      }
    });
    return clients;
  }

  async getClientList(): Promise<any> {
    console.log("2222");
    const clientList = await this.firebaseService
      .collection('clients',   (ref) =>  ref.where('isActive', '==', true))
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    let result = clientList as Client[];
    return result;
  }
  async getClientIdByGSTNumber(gstNumber: string): Promise<any> {
    const clientList = await this.firebaseService
      .collection('clients', (ref) => ref.where('gstNumber', '==', gstNumber))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    return clientList.map((cl) => cl.payload.doc.id);
  }

  fetchClients() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return userId;
      }),
      take(1),
      switchMap((userId) => {
        return this.firebaseService
          .collection('client-user-access', (ref) =>
            ref.where('userId', '==', fetchedUserId)
          )
          .valueChanges();
      }),
      switchMap((users) => {
        let useraccess = users;
        return this.firebaseService
          .collection('clients', (ref) => ref.where('isActive', '==', true).orderBy("name","asc"))
          .snapshotChanges()
          .pipe(
            map((clients) => {
              return clients.map((client) => {
                var cl = <Client>{ ...(client.payload.doc.data() as {}) };
                if (
                  useraccess.filter((c) => c['clientId'] == cl.id).length > 0 ||
                  this.authService.isAdmin
                ) {
                  cl.clientId = cl.id;
                  cl.id = client.payload.doc.id;
                  return cl;
                }
                return null;
              });
            })
          );
      }),

      tap((clients) => {
        this._clients.next(clients.filter((c) => c != null));
      })
    );
  }
  addClient(
    name: string,
    contactPerson: string,
    contactNumber: number,
    email: string,
    potentialNature: string,
    accountOwner: string,
    group: string,
    gstNumber: string,
    employeeStrength: string,
    potentialNatureId: string,
    country: string,
    region: string,
    subRegion: string,
    state: string,
    city: string,
    locationId: string,
    updatedOn: Date,
    divisionIds?: string[],
    divisions?: string[],
    typeIds?: string[],
    types?: string[]
  ) {
    let generatedId: string;
    let newClient: Client;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No User Id Found!');
        }
        newClient = new Client(
          Math.random().toString(),
          name,
          contactPerson,
          contactNumber,
          email,
          potentialNature,
          accountOwner,
          fetchedUserId,
          group,
          gstNumber,
          employeeStrength,
          potentialNatureId,
          country,
          region,
          subRegion,
          state,
          city,
          locationId,
          updatedOn,
          divisionIds,
          divisions,
          typeIds,
          types,
          '',
          true
        );
        return this.firebaseService
          .collection('clients')
          .add(Object.assign({}, newClient));
      }),
      switchMap((client) => {
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

  editClient(
    clientId: string,
    name: string,
    contactPerson: string,
    contactNumber: number,
    email: string,
    potentialNature: string,
    accountOwner: string,
    group: string,
    gstNumber: string,
    employeeStrength: string,
    potentialNatureId: string,
    country: string,
    region: string,
    subRegion: string,
    state: string,
    city: string,
    locationId: string,
    updatedOn: Date,
    divisionIds?: string[],
    divisions?: string[],
    typeIds?: string[],
    types?: string[],
    actclientId?: string
  ) {
    let updatedClients: Client[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
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
        const updatedClientIndex = clients.findIndex(
          (pl) => pl.id === clientId
        );
        updatedClients = [...clients];
        const oldClient = updatedClients[updatedClientIndex];
        updatedClients[updatedClientIndex] = new Client(
          actclientId,
          name,
          contactPerson,
          contactNumber,
          email,
          potentialNature,
          accountOwner,
          oldClient.userId,
          group,
          gstNumber,
          employeeStrength,
          potentialNatureId,
          country,
          region,
          subRegion,
          state,
          city,
          locationId,
          updatedOn,
          divisionIds,
          divisions,
          typeIds,
          types,
          clientId,
          true
        );
        return this.firebaseService
          .collection('clients')
          .doc(clientId)
          .update(Object.assign({}, updatedClients[updatedClientIndex]));
      }),
      take(1),
      tap(() => {
        this._clients.next(updatedClients);
      })
    );
  }

  deleteClient(clientId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('clients')
          .doc(clientId)
          .update({ isActive: false });
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

  getLocations() {
    return this.firebaseService
      .collection('location')
      .valueChanges()
      .pipe(
        switchMap((locs) => {
          const cityIds = locs.map((l) => l['cityId']);
          const countryIds = locs.map((l) => l['countryId']);
          const regionIds = locs.map((l) => l['regionId']);
          const subregionIds = locs.map((l) => l['subregionId']);
          const stateIds = locs.map((l) => l['stateId']);
          return combineLatest([
            of(locs),
            combineLatest(
              cityIds.map((cityId) => {
                return this.firebaseService
                  .collection('city', (ref) => ref.where('id', '==', cityId))
                  .valueChanges()
                  .pipe(map((cities) => cities[0]));
              })
            ),
            combineLatest(
              countryIds.map((contryId) => {
                return this.firebaseService
                  .collection('country', (ref) =>
                    ref.where('id', '==', contryId)
                  )
                  .valueChanges()
                  .pipe(map((countries) => countries[0]));
              })
            ),
            combineLatest(
              regionIds.map((regionId) => {
                return this.firebaseService
                  .collection('region', (ref) =>
                    ref.where('id', '==', regionId)
                  )
                  .valueChanges()
                  .pipe(map((regions) => regions[0]));
              })
            ),
            combineLatest(
              subregionIds.map((subregionId) => {
                return this.firebaseService
                  .collection('subregion', (ref) =>
                    ref.where('id', '==', subregionId)
                  )
                  .valueChanges()
                  .pipe(map((subregion) => subregion[0]));
              })
            ),
            combineLatest(
              stateIds.map((stateId) => {
                return this.firebaseService
                  .collection('state', (ref) => ref.where('id', '==', stateId))
                  .valueChanges()
                  .pipe(map((states) => states[0]));
              })
            ),
          ]);
        }),
        map(([locs, cities, countries, regions, subregions, states]) => {
          return locs.map((loc) => {
            return {
              ...(loc as {}),
              cityId: cities.find((a) => a['id'] === loc['cityId']),
              countryId: countries.find((a) => a['id'] === loc['countryId']),
              regionId: regions.find((a) => a['id'] === loc['regionId']),
              subregionId: subregions.find(
                (a) => a['id'] === loc['subregionId']
              ),
              stateId: states.find((a) => a['id'] === loc['stateId']),
            };
          });
        }),
        take(1)
      );
  }
  async sendEmail(){
  var emailobj = {
    to: 'jyoti.gogave@dwijafoods.com',
    from: 'jyoti.gogave@dwijafoods.com',
    subject: 'Demo request raised by Jyoti',
    location: [
      {
        city: 'Pune',
        address: 'Magarppta City',
        stDate: '01 Apr 2021',
        contact: 'Facility Team',
        machines:[{
          name:'Brewer',
          type:'Manual',
          category:'5 ltr',
          mchCount:'2'
        }]
      },
    ],
  };
    return await this.http
      .post(
        'https://us-central1-db-xtc-cafe-dev.cloudfunctions.net/emailMessage',
        emailobj
      )
      .pipe(map((res) => res))
      .toPromise();
  }
}

