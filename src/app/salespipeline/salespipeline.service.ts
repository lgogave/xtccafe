import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Salespipeline } from './salespipeline.model';

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
  providedIn: 'root'
})
export class SalespipelineService {
  private _salespipeline = new BehaviorSubject<Salespipeline[]>([]);
  constructor(private authService: AuthService, private http: HttpClient,private firebaseService:AngularFirestore) { }

  get salespipeline(){
    return this._salespipeline.asObservable();
  }

  getSalespipeline(id: string) {
    return this.authService.token.pipe(take(1),
    switchMap((token) => {
     return this.firebaseService.collection('salespipeline').doc<Salespipeline>(id).valueChanges();
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
      //  let url:string='';
      //   //temp
      //   if(fetchedUserId=="Wb5tr6u5oIeu966F1KtqS31qFTn2"){
      //     url=`https://ionic-angular-course-78008-default-rtdb.firebaseio.com/salespipeline.json?auth=${token}`
      //   }
      //   else{
      //     url= `https://ionic-angular-course-78008-default-rtdb.firebaseio.com/salespipeline.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
      //   }
      //   return this.http.get<{ [key: string]: SalespipelineData }>(url);
      return this.firebaseService.collection('salespipeline',ref=>ref.where('userId','==',fetchedUserId))
      .snapshotChanges().pipe(map(sales=>{
        return sales.map(sale=>{
          var sl= <Salespipeline>{...sale.payload.doc.data() as {}};
          sl.id=sale.payload.doc.id;
          return sl;
        })
      }));
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
    value: string,
  ) {
    let generatedId: string;
    let newSalespipeline: Salespipeline;
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
        return this.firebaseService.collection('salespipeline').add(Object.assign({}, newSalespipeline));
      }),
      switchMap(sale=>{
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
    salesId:string,
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
  ) {
    let updatedSales: Salespipeline[];
    let fetchedToken:string;
    return this.authService.token.pipe(take(1),switchMap(token=>{
      fetchedToken=token;
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
        const updatedSalesIndex = salespipeline.findIndex((pl) => pl.id === salesId);
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
        return this.firebaseService.collection('salespipeline').doc(salesId).update(Object.assign({}, updatedSales[updatedSalesIndex]));
      }),
      tap(() => {
        this._salespipeline.next(updatedSales);
      })
    );
  }

  deleteSalespipeline(saleId:string) {

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.firebaseService
          .collection('salespipeline')
          .doc(saleId)
          .delete();
      }),
      take(1),switchMap(()=>{
    return this.salespipeline;
    }), take(1),tap(sales=>{
      this._salespipeline.next(sales.filter(b=>b.id!==saleId));
    }));
  }

}
