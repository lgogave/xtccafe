import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, observable, of } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BillingDetail, ClientComment, ClientCommentModel, ClientSales, ClientSalesPipeline, DCDetail, DCDetailModel, InstallDCDetail, Invoice, InvoiceMonth, ReceiptBook, RentalInvoice, SalesPipeline } from './salespipeline.model';
import type firebase from 'firebase';
import { GetNewId } from '../utilities/dataconverters';


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
            tap((client) => {
              this._clientSales.next(client);
            })
          );
      }),
      take(1)
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
  addupdateBillingDetail(billingDetail: BillingDetail,isUpdate:boolean=false) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        billingDetail.userId = fetchedUserId;
        billingDetail.createdOn = new Date();
        if(!isUpdate){
          billingDetail.id=GetNewId();
          return this.firebaseService
          .collection('billing-detail')
          .add(Object.assign({}, billingDetail));
        }
        else{
          return this.firebaseService
          .collection('billing-detail').doc(billingDetail.id)
          .update(Object.assign({}, billingDetail));
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }
  addupdateDC(dc: any,isUpdate:boolean=false) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        dc.userId = fetchedUserId;
        dc.createdOn = new Date();
        if(!isUpdate){
          dc.id=GetNewId();
          return this.firebaseService
          .collection('delivery-challan')
          .add(Object.assign({}, dc));
        }
        else{
          return this.firebaseService
          .collection('delivery-challan').doc(dc.id)
          .update(Object.assign({}, dc));
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }
  addupdateInvoice(invoice: Invoice,isUpdate:boolean=false,isDelete=false) {
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        invoice.userId = fetchedUserId;
        if(isDelete){
          invoice.isDeleted=true;
          return this.firebaseService
          .collection('invoice').doc(invoice.id)
          .update(Object.assign({}, invoice));
        }
        else if(!isUpdate){
          invoice.tranCharges=0;
          invoice.isDeleted=false;
          invoice.id=GetNewId();
          return this.firebaseService
          .collection('invoice')
          .add(Object.assign({}, invoice));
        }
        else{
          invoice.isDeleted=false;
          return this.firebaseService
          .collection('invoice').doc(invoice.id)
          .update(Object.assign({}, invoice));
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }
  addupdateRentalInvoice(invoice: RentalInvoice,isUpdate:boolean=false,isDelete=false) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        invoice.userId = fetchedUserId;
        if(isDelete){
          invoice.isDeleted=true;
          return this.firebaseService
          .collection('rental-invoice').doc(invoice.id)
          .update(Object.assign({}, invoice));
        }
        else if(!isUpdate){
          invoice.isDeleted=false;
          invoice.id=GetNewId();
          return this.firebaseService
          .collection('rental-invoice')
          .add(Object.assign({}, invoice));
        }
        else{
          invoice.isDeleted=false;
          return this.firebaseService
          .collection('rental-invoice').doc(invoice.id)
          .update(Object.assign({}, invoice));
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }
  addupdateReceiptBook(receipt: ReceiptBook,isUpdate:boolean=false) {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      map((userId) => {
        if (!userId) {
          throw new Error('No User Id Found!');
        }
        fetchedUserId = userId;
      }),
      switchMap(() => {
        receipt.userId = fetchedUserId;
        receipt.createdOn = new Date();
        if(!isUpdate){
          receipt.id=GetNewId();
          return this.firebaseService
          .collection('invoice-series')
          .add(Object.assign({}, receipt));
        }
        else{
          return this.firebaseService
          .collection('invoice-series').doc(receipt.id)
          .update(Object.assign({}, receipt));
        }
      }),
      map((doc) => {
        return doc;
      }),
      take(1)
    );
  }

  async getBillingDetail(salesId: string,locationId:string): Promise<any> {
    let snaps = await this.firebaseService
      .collection('billing-detail', (ref) =>
        ref.where('salesId', '==', salesId)
        .where('locationId', '==', locationId))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
      let billingRate:BillingDetail[];
      billingRate=snaps.map((billDetail) => {
          var sl = <BillingDetail>{
            ...(billDetail.payload.doc.data() as {}),
          };
          sl.id = billDetail.payload.doc.id;
          return sl;
        });
    return billingRate.length>0?billingRate[0]:null;
  }

  async getRateDetail(): Promise<BillingDetail[]> {
    let snaps= await this.firebaseService
    .collection('billing-detail')
    .snapshotChanges()
    .pipe(first())
    .toPromise();
    let rows:BillingDetail[];
    rows=snaps.map((entry) => {
        var sl = <BillingDetail>{
          ...(entry.payload.doc.data() as {}),
        };
        sl.id = entry.payload.doc.id;
        return sl;
      });
      return rows;
    }

  async getMastRateByLocation(locationId:string): Promise<any> {
    let snaps = await this.firebaseService
      .collection('billing-detail', (ref) =>
        ref.where('locationId', '==', locationId))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
      let billingRate:BillingDetail[];
      billingRate=snaps.map((billDetail) => {
          var sl = <BillingDetail>{
            ...(billDetail.payload.doc.data() as {}),
          };
          sl.id = billDetail.payload.doc.id;
          return sl;
        });
    return billingRate.length>0?billingRate[0]:null;
  }

  async getDCDetail(dcId: string,type:number=0): Promise<any> {
    if(type==0){
      let snaps = await this.firebaseService
      .collection('delivery-challan').doc(dcId).get().toPromise();
      var result = <DCDetail>{
        ...(snaps.data() as {}),
      };
      result.id = snaps.id;
    return result;
    }
    else if(type==1){
      let snaps = await this.firebaseService
        .collection('delivery-challan')
        .doc(dcId)
        .get()
        .toPromise();
      var installresult = <InstallDCDetail>{
        ...(snaps.data() as {}),
      };
      installresult.id = snaps.id;
      return installresult;
    }

  }

  async getDeliveryChallans(clientId:string): Promise<DCDetailModel[]> {
    let snaps:any;
    if(clientId==null){
      snaps= await this.firebaseService
      .collection('delivery-challan', (ref) =>
        ref.orderBy('date','desc'))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    }
    else
    {
      snaps= await this.firebaseService
      .collection('delivery-challan', (ref) =>
      ref.where('clientId','==',clientId)
      .orderBy('date','desc'))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    }

      let dcdetail:DCDetailModel[];
      dcdetail=snaps.map((billDetail) => {
          var sl = <DCDetailModel>{
            ...(billDetail.payload.doc.data() as {}),
          };
          sl.id = billDetail.payload.doc.id;
          return sl;
        });
        return dcdetail;
  }

  async getSalesPipline(): Promise<ClientSalesPipeline[]> {
    let snaps= await this.firebaseService
    .collection('client-sales-pipeline', (ref) =>
      ref.orderBy('client','asc'))
    .snapshotChanges()
    .pipe(first())
    .toPromise();
    let rows:ClientSalesPipeline[];
    rows=snaps.map((entry) => {
        var sl = <ClientSalesPipeline>{
          ...(entry.payload.doc.data() as {}),
        };
        sl.id = entry.payload.doc.id;
        return sl;
      });
      return rows;
    }

  async getSalesPiplineById(salesId:string): Promise<ClientSalesPipeline> {
        let snaps = await this.firebaseService
        .collection('client-sales-pipeline').doc(salesId).get().toPromise();
        var result = <ClientSalesPipeline>{
          ...(snaps.data() as {}),
        };
        result.id = snaps.id;
      return result;
      }

  async getInvoices(locId:string): Promise<Invoice[]> {
    let snaps:any;
    if(locId==null){
      snaps= await this.firebaseService
      .collection('invoice', (ref) =>
      ref.where('isDeleted','==',false).orderBy('createdOn','desc'))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    }
    else
    {
      snaps= await this.firebaseService
      .collection('invoice', (ref) =>
      ref.where('isDeleted','==',false)
      .where('clientLocationId','==',locId)
      )
      .snapshotChanges()
      .pipe(first())
      .toPromise();
    }
      let dcdetail:Invoice[];
      dcdetail=snaps.map((billDetail) => {
          var sl = <Invoice>{
            ...(billDetail.payload.doc.data() as {}),
          };
          sl.id = billDetail.payload.doc.id;
          return sl;
        });
        return dcdetail;
  }

  async getInvoiceByDCId(dcId: string): Promise<any> {
    let snaps = await this.firebaseService
      .collection('invoice', (ref) =>
        ref.where('dcIds', 'array-contains', dcId))
      .snapshotChanges()
      .pipe(first())
      .toPromise();
      let invoices:Invoice[];
      invoices=snaps.map((inv) => {
          var sl = <Invoice>{
            ...(inv.payload.doc.data() as {}),
          };
          sl.id = inv.payload.doc.id;
          return sl;
        });
    return invoices.length>0?invoices[0]:null;
  }

  async getInvoiceById(invId:string): Promise<Invoice> {
    let snaps = await this.firebaseService
    .collection('invoice').doc(invId).get().toPromise();
    var result = <Invoice>{
      ...(snaps.data() as {}),
    };
    result.id = snaps.id;
  return result;
}

  async getlastReceiptNumber(receipt:ReceiptBook): Promise<ReceiptBook>{
    let snaps:any;
      snaps= await this.firebaseService
      .collection('invoice-series', (ref) =>
      ref.where('category','==',receipt.category)
      .where('type','==',receipt.type)
      .where('branch','==',receipt.branch)
      .where('year','==',receipt.year)
      .orderBy("createdOn","desc").limit(1)
      )
      .snapshotChanges()
      .pipe(first())
      .toPromise();
      let receiptNumber:ReceiptBook[]=snaps.map((receipt) => {
          var obj = <ReceiptBook>{
            ...(receipt.payload.doc.data() as {}),
          };
          obj.id = receipt.payload.doc.id;
          return obj;
        });
        if(receiptNumber && receiptNumber.length>0){
          return receiptNumber[0];
        }
        else{
          return null;
        }
  }

  async getInvoiceMonth():Promise<InvoiceMonth[]>{
    let snaps=await this.firebaseService
    .collection('invoice-month', (ref) =>
      ref.orderBy('month','desc'))
    .snapshotChanges()
    .pipe(first())
    .toPromise();
    let invMonth:InvoiceMonth[];
    invMonth=snaps.map((month) => {
        var sl = <InvoiceMonth>{
          ...(month.payload.doc.data() as {}),
        };
        sl.id = month.payload.doc.id;
        return sl;
      });
      return invMonth;




    }

    async getRentalInvoice(clientId:string,locId:string,displyMonth:string): Promise<RentalInvoice[]> {
      let snaps:any;
       if(locId==null && displyMonth!=null){
        snaps= await this.firebaseService
        .collection('rental-invoice', (ref) =>
        ref.where('isDeleted','==',false)
        .where('displaymonth','==',displyMonth))
        .snapshotChanges()
        .pipe(first())
        .toPromise();
      }
      else if(clientId==null){
        snaps= await this.firebaseService
        .collection('rental-invoice', (ref) =>
        ref.where('isDeleted','==',false).orderBy('createdOn','desc'))
        .snapshotChanges()
        .pipe(first())
        .toPromise();
      }
      else
      {
        snaps= await this.firebaseService
        .collection('rental-invoice', (ref) =>
        ref.where('clientId','==',clientId)
        .where('clientLocationId','==',locId)
        .where('displaymonth','==',displyMonth)
        .where('isDeleted','==',false)
        )
        .snapshotChanges()
        .pipe(first())
        .toPromise();
      }

        let rentdetail:RentalInvoice[];
        rentdetail=snaps.map((rcDetail) => {
            var sl = <RentalInvoice>{
              ...(rcDetail.payload.doc.data() as {}),
            };
            sl.id = rcDetail.payload.doc.id;
            return sl;
          });
          return rentdetail;
    }

}


