import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, observable, of } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ClientSales, ClientSalesPipeline, SalesPipeline } from './salespipeline.model';
import type firebase from 'firebase';


@Injectable({
  providedIn: 'root',
})
export class SalespipelineService {
  private _clientSales = new BehaviorSubject<ClientSales[]>([]);
  private _clientSalespipeline = new BehaviorSubject<ClientSalesPipeline[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private firebaseService: AngularFirestore
  ) {}

  get clientSales() {
    return this._clientSales.asObservable();
  }

  get clientSalepipeline() {
    return this._clientSalespipeline.asObservable();
  }

  async getSalesPipelineList(clientId:string): Promise<any> {
    const clientList = await this.firebaseService.collection('salespipeline',ref=>ref.where('clientId','==',clientId))
      .valueChanges().pipe(first()).toPromise();
    return clientList as SalesPipeline[];
  }

  addSalesPipeline(salesPipeline: SalesPipeline) {
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        salesPipeline.userId = userId;
        return this.firebaseService
          .collection('salespipeline')
          .add(Object.assign({}, salesPipeline));
      }),
      map((sale) => {
        //this._salespipeline.next(this..concat(salesPipeline));
        return sale.id;
      })
    );
  }

  addClientSalesPipeline(salesPipeline: ClientSalesPipeline) {
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        salesPipeline.userId = userId;
        return this.firebaseService
          .collection('client-sales-pipeline')
          .add(Object.assign({}, salesPipeline));
      }),
      map((sale) => {
        return of(sale.id);
      })
    );

  }

  editClientSalesPipeline(salesId:string,salesPipeline: ClientSalesPipeline) {
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        salesPipeline.userId = userId;
          return this.firebaseService
          .collection('client-sales-pipeline')
          .doc(salesId)
          .update(Object.assign({}, salesPipeline));
      }),
      map((sale) => {
        return of(salesId);
      })
    );

  }

  fetchClientSalesPipeline() {
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        return this.firebaseService
          .collection('client-sales-pipeline', (ref) => ref.where('userId', '==', userId))
          .snapshotChanges();
      }),
      map((salespipelines) => {
        return salespipelines.map((salespipeline) => {
          var sl = <ClientSalesPipeline>{
            ...(salespipeline.payload.doc.data() as {}),
          };
          sl.id = salespipeline.payload.doc.id;
          return sl;
        });
      }),
      map((salespipelines) => {
        this._clientSalespipeline.next(salespipelines);
      })
    );
  }

  fetchSalesPipeline() {
    let clientSales: ClientSales[] = [];
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        return this.firebaseService
          .collection('salespipeline', (ref) =>
            ref.where('userId', '==', userId).orderBy('updatedOn')
          )
          .valueChanges();
      }),
      map((clients) => {
        return clients.map((client) => {
          if (
            clientSales.findIndex((x) => x.clientId === client['clientId']) ==
              -1 &&
            client['clientId'] != undefined
          ) {
            console.log(client['clientId']);
            clientSales.push(
              new ClientSales(
                client['clientId'],
                client['client'],
                client['comment']
              )
            );
          }
        });
      }),
      map((clients) => {
        this._clientSales.next(clientSales);
      })
    );
  }

  getClientSalesPipeline(id: string) {
    let clientSales: ClientSalesPipeline[] = [];
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        return this.firebaseService
          .collection('client-sales-pipeline').doc(id).get()
      }),
      map((salespipeline) => {
        console.log(salespipeline.data());
        var sl = <ClientSalesPipeline>{ ...(salespipeline.data() as {}) };
        sl.id = salespipeline.id;
        return sl;
      }),
       map((salespipelines) => {
       return salespipelines;
      })
    );
  }

  deleteClientSalesPipeline(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('client-sales-pipeline')
          .doc(id)
          .delete();
      }),
      take(1),
      switchMap(() => {
        return this.clientSalepipeline;
      }),
      take(1),
      tap((sales) => {
        this._clientSalespipeline.next(sales.filter((b) => b.id !== id));
      })
    );
  }

  async deleteSalesPipelineByClietId(clientId: string) {
    return await this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        return this.firebaseService
          .collection('salespipeline',ref=>ref.where("clientId","==",clientId)).snapshotChanges()
      }),
      map((clients) => {
        return clients.map((client) => {
          return this.firebaseService
          .collection('salespipeline').doc(client.payload.doc.id).delete();
        })
      }),
      first()
    ).toPromise();
  }

  deleteSalesPipeline(clientId: string) {
    return this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        return userId;
      }),
      switchMap((userId) => {
        return this.firebaseService
          .collection('salespipeline',ref=>ref.where("clientId","==",clientId)).snapshotChanges()
      }),
      map((clients) => {
        return clients.map((client) => {
          return this.firebaseService
          .collection('salespipeline').doc(client.payload.doc.id).delete();
        })
      }),
      map((clients) => {
       return clients;
      }),
    );
  }

  async getClientById(clientId:string): Promise<any> {
    const clientList = await this.firebaseService.collection('client-sales-pipeline',ref=>ref.where('clientId','==',clientId))
      .valueChanges().pipe(first()).toPromise();
    return clientList;
  }


 convertTimeStampToDate(date:any):Date{
 return (date as firebase.firestore.Timestamp).toDate();
 }


}
