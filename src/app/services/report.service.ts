import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { first } from 'rxjs/operators';
import { ClientSalesPipeline, DCDetail, Invoice, RentalInvoice } from '../salespipeline/salespipeline.model';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private firebaseService: AngularFirestore) { }

  async downloadDC(){
    var collection="delivery-challan";
    let snaps = await this.firebaseService.collection(collection).snapshotChanges().pipe(first()).toPromise();
    let tempDoc:DCDetail[];
    tempDoc=snaps.map((entry) => {
        var sl = <DCDetail>{
          ...(entry.payload.doc.data() as {}),
        };
        sl.id = entry.payload.doc.id;
        return sl;
      });
       var jsonArray=[];
        tempDoc.forEach(function(element,index){
          element?.materialDetails?.forEach(function(mat,index){
            var data={
              client:element.billName,
              clientAddress:element.billAddress,
              isUsed:element.isUsed,
              location:element.location,
              category:mat.category,
              item:mat.item,
              gst:mat.gst,
              qty:mat.qty,
              rate:mat.rate,
              amount:mat.amount,
              tax:mat.tax,
              totamount:mat.totamount,
              date:element.date,
              isDeleted:element.isDelete,
              srNo:element.srNo
            }
            jsonArray.push(data)
          })
      });
      return jsonArray;
  }

  async downloadSalesPipeline(){
    var collection="client-sales-pipeline";
    let snaps = await this.firebaseService.collection(collection).snapshotChanges().pipe(first()).toPromise();
    let tempDoc:ClientSalesPipeline[];
    tempDoc=snaps.map((entry) => {
        var sl = <ClientSalesPipeline>{
          ...(entry.payload.doc.data() as {}),
        };
        sl['refId'] = entry.payload.doc.id;
        return sl;
      });
       var jsonArray=[];
      tempDoc.forEach(function(element,index){
      element.locations.forEach(function(loc,index){
        loc?.machines?.forEach(function(mch,index){
          var data={
            id:element['refId'],
            client:element.client,
            clientAddress:loc.address,
            location:loc.city,
            installAt:loc.installAt,
            installAddress:loc.installAddress,
            locationId:loc.id,
            currentStatus:loc.currentStatus,
            machineName:mch.machineName,
            machinehsncode:mch.machinehsncode,
            machineSrNo:mch.machineSrNo,
            machineCount:mch.machineCount,
            mchRent:mch.mchRent,
            mchSecDeposite:mch.mchSecDeposite,
          }
        jsonArray.push(data)
        })
      })
    })
  return jsonArray;
  }

  async downloadInvoices(){
    var collection="invoice";
    let snaps = await this.firebaseService.collection(collection).snapshotChanges().pipe(first()).toPromise();
    let tempDoc:Invoice[];
    tempDoc=snaps.map((entry) => {
        var sl = <Invoice>{
          ...(entry.payload.doc.data() as {}),
        };
        sl.id = entry.payload.doc.id;
        return sl;
      });
       var jsonArray=[];

  var monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];
    var jsonArray=[];
    tempDoc.forEach(function(element,index){
  if (element?.isDeleted == false) {
    var invDate = new Date(element.createdOn['seconds'] * 1000);
    var data = {
      id: element.srNo,
      type:
        element.srNo.indexOf('/Machine') > -1 ? 'Installation' : 'Consumable',
      billName: element.billName,
      billAddress: element.billAddress,
      deliverybranch: element.branch,
      installAt: element.installAt,
      installAddress: element.installAddress,
      date:
        invDate.getDate() +
        ' ' +
        monthNames[invDate.getMonth()] +
        ' ' +
        invDate.getFullYear(),
      month: element.displaymonth,
      taxType: element.taxType,
      amount:element.amount.toString(),
      tax:element.tax.toString(),
      Total:(element.tax+element.amount).toString(),
    };
    jsonArray.push(data);
  }
});
  return jsonArray;
}

async downloadRentalInvoices(month:string){
  var collection="rental-invoice";
  let snaps = await this.firebaseService.collection(collection).snapshotChanges().pipe(first()).toPromise();
  let tempDoc:RentalInvoice[];
  tempDoc=snaps.map((entry) => {
      var sl = <Invoice>{
        ...(entry.payload.doc.data() as {}),
      };
      sl.id = entry.payload.doc.id;
      return sl;
    });
     var jsonArray=[];

var monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
  var jsonArray=[];
  tempDoc.forEach(function(element,index){
if (element?.isDeleted == false && element.displaymonth==month) {
  var invDate = new Date(element.createdOn['seconds'] * 1000);
  var data={
    id:element.srNo,
    type:'Rental',
    billName:element.billName,
    billAddress:element.billAddress,
    //deliverybranch:element?.bank?.length>0?element.bank[0].branch:'',
    installAt:element.installAt,
    installAddress:element.installAddress,
    date: invDate.getDate() + ' ' + monthNames[invDate.getMonth()] + ' ' + invDate.getFullYear(),
    month:element.displaymonth,
    taxType:element.taxType,
    amount:(element.mchRent).toString(),
    tax:(element.mchRent*0.18).toString(),
    Total:(element.mchRent+(element.mchRent*0.18)).toString(),
   }
  jsonArray.push(data);
}
});
return jsonArray;
}

}

