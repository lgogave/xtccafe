import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { BranchStockRegister, EntryType, StockMaterial, StockRegister } from './stockregister.model';

@Injectable({
  providedIn: 'root'
})

export class StockRegisterService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private firebaseService: AngularFirestore
  ) {}
  async addupdate(stock: any,isUpdate:boolean=false) {
  let userId= this.authService.userId['source']["source"]['value']["id"];
  stock.userId = userId;
  stock.createdOn = new Date();
  if(!isUpdate){
    return await this.firebaseService
    .collection('stock-register')
    .add(Object.assign({}, stock)).then(res=>{
      return stock;
    }).catch((e:Error)=>{
      return e;
    });
  }
  else{
    let snaps=await this.firebaseService
    .collection('stock-register', (ref) =>
    ref.where('sourceId','==',stock.sourceId)
    ).snapshotChanges().pipe(first()).toPromise();
    let documnets:StockRegister[]=snaps.map((doc) => {
    var obj = <StockRegister>{
        ...(doc.payload.doc.data() as {}),
      };
    obj.id = doc.payload.doc.id;
    return obj;
    });
    let docRef=documnets[0].id;
    return await this.firebaseService
      .collection('stock-register')
      .doc(docRef)
      .update(Object.assign({}, stock))
      .then((res) => {
        return stock;
      }).catch((e:Error)=>{
        return e;
      })
  }
}

async getAll(): Promise<StockRegister[]> {
  let snaps:any;
    snaps= await this.firebaseService
    .collection('stock-register', (ref) =>
      ref.orderBy('createdOn','desc'))
    .snapshotChanges()
    .pipe(first())
    .toPromise();
  let documents:StockRegister[];
  documents=snaps.map((doc) => {
      var sl = <StockRegister>{
        ...(doc.payload.doc.data() as {}),
      };
      sl.id = doc.payload.doc.id;
      return sl;
    });
    return documents;
}

getByBranch(stocks:StockRegister[]):BranchStockRegister[]{
  let branchStock:BranchStockRegister[]=[];
  stocks.forEach(element => {
  let branchObj=branchStock.filter(x=>x.branch===element.branch);
  let st:BranchStockRegister=null;
  if(branchObj.length>0)
     st=branchObj[0];
   else{
     st = <BranchStockRegister>{ branch: element.branch,materialDetails:[] };
     branchStock.push(st);
   }
   element.materialDetails.forEach(material => {
    let materialObj=st.materialDetails.filter(x=>
      x.item==material['item'] &&  x.category===material['category']);
      if(materialObj.length>0)
      {
        if(element.sourceName=="GRN" && element.entryType==EntryType.Credit){
          materialObj[0].qty=materialObj[0].qty+
          Number(material['actQtyRecived']);
        }
        else if(element.entryType==EntryType.Debit){
          materialObj[0].qty=materialObj[0].qty-
          Number(material['qty']);
        }
      }
      else{
        let stmaterial=<StockMaterial> {item:material['item'],category:material['category']};
        if(element.sourceName=="GRN" && element.entryType==EntryType.Credit){
          stmaterial.qty=Number(material['actQtyRecived']);
        }
        else if(element.entryType==EntryType.Debit){
          stmaterial.qty= Number(material['qty'])*-1;
        }
        st.materialDetails.push(stmaterial);
      }
   });
 });
return branchStock;
}






}
