import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, observable, of } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ClientSales, ClientSalesPipeline, SalesPipeline, Salespipeline } from './salespipeline.model';
import type firebase from 'firebase';

interface SalespipelineData{
      client: string,
      brewer: string,
      fm: string,
      btoc: string,
      preMix: string,
      mtrl: string,
      amount: number,
      currentStatus: string,
      potentialStatus: string,
      closuredate: Date,
      region: string,
      location: string,
      comments: string,
      win: string,
      value: string,
      userId: string
}


@Injectable({
  providedIn: 'root',
})
export class SalespipelineService {
  private _salespipeline = new BehaviorSubject<Salespipeline[]>([]);
  private _clientSales = new BehaviorSubject<ClientSales[]>([]);
  private _clientSalespipeline = new BehaviorSubject<ClientSalesPipeline[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private firebaseService: AngularFirestore
  ) {}

  get salespipeline() {
    return this._salespipeline.asObservable();
  }

  getSalespipeline(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('salespipeline')
          .doc<Salespipeline>(id)
          .valueChanges();
      }),
      map((resData) => {
        return new Salespipeline(
          id,
          resData.client,
          resData.brewer,
          resData.fm,
          resData.btoc,
          resData.preMix,
          resData.mtrl,
          resData.amount,
          resData.currentStatus,
          resData.potentialStatus,
          new Date(resData.closuredate),
          resData.region,
          resData.location,
          resData.comments,
          resData.win,
          resData.value,
          resData.userId
        );
      })
    );
  }
  fetchSalespipeline() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        //  let url:string='';
        //   //temp
        //   if(fetchedUserId=="Wb5tr6u5oIeu966F1KtqS31qFTn2"){
        //     url=`https://ionic-angular-course-78008-default-rtdb.firebaseio.com/salespipeline.json?auth=${token}`
        //   }
        //   else{
        //     url= `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/salespipeline.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        //   }
        //   return this.http.get<{ [key: string]: SalespipelineData }>(url);
        return this.firebaseService
          .collection('salespipeline', (ref) =>
            ref.where('userId', '==', fetchedUserId)
          )
          .snapshotChanges()
          .pipe(
            map((sales) => {
              return sales.map((sale) => {
                var sl = <Salespipeline>{ ...(sale.payload.doc.data() as {}) };
                sl.id = sale.payload.doc.id;
                return sl;
              });
            })
          );
      }),
      map((resData) => {
        const salespipeline = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            salespipeline.push(
              new Salespipeline(
                key,
                resData[key].client,
                resData[key].brewer,
                resData[key].fm,
                resData[key].btoc,
                resData[key].preMix,
                resData[key].mtrl,
                resData[key].amount,
                resData[key].currentStatus,
                resData[key].potentialStatus,
                new Date(resData[key].closuredate),
                resData[key].region,
                resData[key].location,
                resData[key].comments,
                resData[key].win,
                resData[key].value,
                resData[key].userId
              )
            );
          }
        }
        return salespipeline;
      }),
      tap((salespipeline) => {
        this._salespipeline.next(salespipeline);
      })
    );
  }
  addSalespipeline(
    client: string,
    brewer: string,
    fm: string,
    btoc: string,
    preMix: string,
    mtrl: string,
    amount: number,
    currentStatus: string,
    potentialStatus: string,
    closuredate: Date,
    region: string,
    location: string,
    comments: string,
    win: string,
    value: string
  ) {
    let generatedId: string;
    let newSalespipeline: Salespipeline;
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
        newSalespipeline = new Salespipeline(
          Math.random().toString(),
          client,
          brewer,
          fm,
          btoc,
          preMix,
          mtrl,
          amount,
          currentStatus,
          potentialStatus,
          closuredate,
          region,
          location,
          comments,
          win,
          value,
          fetchedUserId
        );
        return this.firebaseService
          .collection('salespipeline')
          .add(Object.assign({}, newSalespipeline));
      }),
      switchMap((sale) => {
        return sale.id;
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData;
        return this.salespipeline;
      }),
      take(1),
      tap((salespipeline) => {
        newSalespipeline.id = generatedId;
        this._salespipeline.next(salespipeline.concat(newSalespipeline));
      })
    );
  }
  editSalespipeline(
    salesId: string,
    client: string,
    brewer: string,
    fm: string,
    btoc: string,
    preMix: string,
    mtrl: string,
    amount: number,
    currentStatus: string,
    potentialStatus: string,
    closuredate: Date,
    region: string,
    location: string,
    comments: string,
    win: string,
    value: string
  ) {
    let updatedSales: Salespipeline[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.salespipeline;
      }),
      take(1),
      switchMap((salespipeline) => {
        if (!salespipeline || salespipeline.length <= 0) {
          return this.fetchSalespipeline();
        } else {
          return of(salespipeline);
        }
      }),
      switchMap((salespipeline) => {
        const updatedSalesIndex = salespipeline.findIndex(
          (pl) => pl.id === salesId
        );
        updatedSales = [...salespipeline];
        const oldSales = updatedSales[updatedSalesIndex];
        updatedSales[updatedSalesIndex] = new Salespipeline(
          salesId,
          client,
          brewer,
          fm,
          btoc,
          preMix,
          mtrl,
          amount,
          currentStatus,
          potentialStatus,
          closuredate,
          region,
          location,
          comments,
          win,
          value,
          oldSales.userId
        );
        return this.firebaseService
          .collection('salespipeline')
          .doc(salesId)
          .update(Object.assign({}, updatedSales[updatedSalesIndex]));
      }),
      tap(() => {
        this._salespipeline.next(updatedSales);
      })
    );
  }
  deleteSalespipeline(saleId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('salespipeline')
          .doc(saleId)
          .delete();
      }),
      take(1),
      switchMap(() => {
        return this.salespipeline;
      }),
      take(1),
      tap((sales) => {
        this._salespipeline.next(sales.filter((b) => b.id !== saleId));
      })
    );
  }

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
        return this.salespipeline;
      }),
      take(1),
      tap((sales) => {
        this._salespipeline.next(sales.filter((b) => b.id !== id));
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

 convertTimeStampToDate(date:any):Date{
 return (date as firebase.firestore.Timestamp).toDate();
 }
}
