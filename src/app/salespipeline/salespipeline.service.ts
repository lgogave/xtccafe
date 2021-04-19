import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, observable, of } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ClientComment, ClientCommentModel, ClientSales, ClientSalesPipeline, SalesPipeline } from './salespipeline.model';
import type firebase from 'firebase';


@Injectable({
  providedIn: 'root',
})
export class SalespipelineService {
  private _clientSales = new BehaviorSubject<ClientSales[]>([]);
  private _clientSalespipeline = new BehaviorSubject<ClientSalesPipeline[]>([]);
  private _clientcomments = new BehaviorSubject<ClientCommentModel[]>([]);

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

  get clientComments() {
    return this._clientcomments.asObservable();
  }

  async getSalesPipelineList(clientId: string): Promise<any> {
    const clientList = await this.firebaseService
      .collection('salespipeline', (ref) =>
        ref.where('clientId', '==', clientId)
      )
      .valueChanges()
      .pipe(first())
      .toPromise();
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
        salesPipeline.action = 'add';
        this.firebaseService
          .collection('client-sales-pipeline-log')
          .add(Object.assign({}, salesPipeline));
        return this.firebaseService
          .collection('client-sales-pipeline')
          .add(Object.assign({}, salesPipeline))
          .then((doc) => {
            this.firebaseService
              .collection('track-client-comment')
              .add(
                Object.assign(
                  {},
                  new ClientComment(
                    doc.id,
                    salesPipeline.comment,
                    new Date(),
                    userId
                  )
                )
              );
            return doc;
          });
      }),
      map((sale) => {
        return of(sale.id);
      })
    );
  }

  editClientSalesPipeline(
    salesId: string,
    salesPipeline: ClientSalesPipeline,
    lastComment: string
  ) {
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

        salesPipeline.action = 'edit';
        this.firebaseService
          .collection('client-sales-pipeline-log')
          .add(Object.assign({}, salesPipeline));
        return this.firebaseService
          .collection('client-sales-pipeline')
          .doc(salesId)
          .update(Object.assign({}, salesPipeline))
          .then((doc) => {
            if (lastComment !== salesPipeline.comment) {
              this.firebaseService
                .collection('track-client-comment')
                .add(
                  Object.assign(
                    {},
                    new ClientComment(
                      salesId,
                      salesPipeline.comment,
                      new Date(),
                      userId
                    )
                  )
                );
            }
            return doc;
          });
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
          .collection('client-sales-pipeline', (ref) =>
            ref.where('userId', '==', userId)
          )
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
          .collection('client-sales-pipeline')
          .doc(id)
          .get();
      }),
      map((salespipeline) => {
        var sl = <ClientSalesPipeline>{ ...(salespipeline.data() as {}) };
        sl.id = salespipeline.id;
        return sl;
      }),
      map((salespipelines) => {
        return salespipelines;
      }),
      first()
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
        return this.clientSales;
      }),
      take(1),
      tap((sales) => {
        this._clientSales.next(sales.filter((b) => b.clientsale.id !== id));
      })
    );
  }

  async deleteSalesPipelineByClietId(clientId: string) {
    return await this.authService.userId
      .pipe(
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
              ref.where('clientId', '==', clientId)
            )
            .snapshotChanges();
        }),
        map((clients) => {
          return clients.map((client) => {
            return this.firebaseService
              .collection('salespipeline')
              .doc(client.payload.doc.id)
              .delete();
          });
        }),
        first()
      )
      .toPromise();
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
          .collection('salespipeline', (ref) =>
            ref.where('clientId', '==', clientId)
          )
          .snapshotChanges();
      }),
      map((clients) => {
        return clients.map((client) => {
          return this.firebaseService
            .collection('salespipeline')
            .doc(client.payload.doc.id)
            .delete();
        });
      }),
      map((clients) => {
        return clients;
      })
    );
  }

  async getClientById(clientId: string): Promise<any> {
    const clientList = await this.firebaseService
      .collection('client-sales-pipeline', (ref) =>
        ref.where('clientId', '==', clientId)
      )
      .valueChanges()
      .pipe(first())
      .toPromise();
    return clientList;
  }

  dd_fetchClientAndSaplesPipeline() {
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
      switchMap(() => {
        return this.firebaseService
          .collection('client-sales-pipeline')
          .valueChanges()
          .pipe(map((cl) => cl.map((sp) => sp)));
      }),
      map((cs) => of(cs)),
      map((j) => {
        j.pipe(
          map((s) => {
            console.log(s);
          })
        );
      })
    );
  }

  fetchClientAndSaplesPipeline() {
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
          .collection('client-sales-pipeline')
          .snapshotChanges()
          .pipe(
            switchMap((sales) => {
              let salesdata = sales.map((sale) => {
                return <ClientSalesPipeline>{
                  ...(sale.payload.doc.data() as {}),
                  id: sale.payload.doc.id,
                };
              });
              const clientsIds = salesdata.map((l) => l['clientId']);
              return combineLatest([
                of(salesdata),
                salesdata.length == 0
                  ? of([])
                  : combineLatest(
                      clientsIds.map((clientId) => {
                        return this.firebaseService
                          .collection('clients', (ref) =>
                            ref.where('id', '==', clientId)
                          )
                          .valueChanges()
                          .pipe(
                            map((clients) => {
                              return clients[0];
                            })
                          );
                      })
                    ),
                salesdata.length == 0
                  ? of([])
                  : combineLatest([
                      this.firebaseService
                        .collection('client-user-access', (ref) =>
                          ref.where('userId', '==', fetchedUserId)
                        )
                        .valueChanges()
                        .pipe(map((users) => users)),
                    ]),
              ]);
            }),
            map(([sales, clients, users]) => {
              let userclients: ClientSalesPipeline[] = [];
              if (users.length > 0) {
                sales.forEach((sale) => {
                  if (
                    users[0].filter((c) => c['clientId'] == sale.clientId)
                      .length > 0 ||
                    this.authService.isAdmin
                  ) {
                    userclients.push(sale);
                  }
                });
              } else {
                userclients = sales;
              }
              return userclients.map((sale) => {
                return <ClientSales>{
                  clientsale: { ...(sale as {}) },
                  client: clients.find(
                    (a) => a != undefined && a['id'] === sale['clientId']
                  ),
                };
              });
            }),
            map((client) => {
              this._clientSales.next(client);
            })
          );
      })
    );
  }

  fetchClientCommets(saleId: string) {
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
          .collection('track-client-comment', (ref) =>
            ref.where('saleId', '==', saleId).orderBy('undatedOn', 'desc')
          )
          .valueChanges()
          .pipe(
            switchMap((comments) => {
              const userIds = comments.map((l) => l['userId']);
              return combineLatest([
                of(comments),
                combineLatest(
                  userIds.map((userId) => {
                    return this.firebaseService
                      .collection('user', (ref) =>
                        ref.where('id', '==', userId)
                      )
                      .valueChanges()
                      .pipe(map((usercmt) => usercmt[0]));
                  })
                ),
              ]);
            })
          );
      }),
      take(1),
      map(([comments, users]) => {
        let allcomments = comments.map((cmt) => {
          return <ClientCommentModel>{
            ...(cmt as {}),
            user: users.find((a) => a['id'] === cmt['userId']),
          };
        });

        this._clientcomments.next(allcomments);
      })
    );
  }
  convertTimeStampToDate(date: any): Date {
    return (date as firebase.firestore.Timestamp).toDate();
  }

  getSalesPipelineById(salesId:string){
    let fetchedUserId:string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId=userId;
      }),
      switchMap(()=>{
        return this.firebaseService
          .collection('client-sales-pipeline')
          .doc(salesId)
          .valueChanges()
      }),
      switchMap(sp=>{
        const clientId=sp['clientId'];
      return combineLatest([
        of(sp),
        combineLatest([
          this.firebaseService
            .collection('clients',ref=>ref.where('id','==',clientId))
            .valueChanges().pipe(first()),
        ]),
      ]);
      }),
      map(([sales,clients])=>{
          return <ClientSales>{
            clientsale:{...(sales as {})},
            client: {...(clients[0][0]as {})}
          }
      }),first());
  }
}


