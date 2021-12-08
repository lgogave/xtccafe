import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { first } from 'rxjs/operators';
import { ClientSalesPipeline, DCDetail, Invoice, RentalInvoice } from '../salespipeline/salespipeline.model';
import { SalespipelineService } from '../salespipeline/salespipeline.service';
import { DivisionService } from './division.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private firebaseService: AngularFirestore,private salesService:SalespipelineService,private divisionService: DivisionService) { }

  async downloadDC(){
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec" ];

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
              srNo:element.srNo,
              branch:element.branch,
              month: monthNames[(new Date(element.date)).getMonth()] + '-' + (new Date(element.date)).getFullYear(),
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
            clientId:element.clientId,
            clientLocationId:loc.id,
            id:element['refId'],
            client:element.client,
            clientAddress:loc.address,
            accOwner:loc.accowner,
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
            pulloutDate:mch.pulloutDate,
            pulloutreason:mch.pulloutreason,
            closureDate:new Date(loc.closureDate['seconds']*1000)
          }
        jsonArray.push(data)
        })
      })
    })
  return jsonArray;
  }

  async downloadInvoices(){

    let billDetail=await this.salesService.getRateDetail();
    let stock=await this.divisionService.getStock();

    let spsnaps= await this.firebaseService.collection('client-sales-pipeline').snapshotChanges().pipe(first()).toPromise();
    let sptempDoc:ClientSalesPipeline[];
    sptempDoc=spsnaps.map((entry) => {
        var sl = <ClientSalesPipeline>{
          ...(entry.payload.doc.data() as {}),
        };
        sl['refId'] = entry.payload.doc.id;
        return sl;
      });
    var clientLocation=[];
    sptempDoc.forEach(element => {
      element.locations.forEach(loc=>{
        clientLocation.push({clientId:element.clientId,locationId:loc.id,location:loc.branchcity,accowner:loc.accowner});
      });
    });




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
      //if(element?.isDeleted==false){
      if(element.billbranch!="Test"){
        var invDate = new Date(element.createdOn['seconds']*1000);
        var arayclientCity=clientLocation.filter(x=>x.clientId==element.clientId && x.locationId==element.clientLocationId);
        var clientCity='';
        var accowner='';
        var gstno='';

        if(arayclientCity.length>0){
          clientCity=arayclientCity[0].location;
          accowner=arayclientCity[0].accowner;
        }

        var billRate=billDetail.filter(x=>x.clientId==element.clientId && x.locationId==element.clientLocationId);
        if(billRate.length>0){
          gstno=billRate[0].gstno;
        }


        element?.dc.forEach(function(dc,dcinx){

        dc?.materialDetails?.forEach(function(mat,minx){
          let cp='';
          let cpAmount=0;
          let mst=stock.filter(x=>x.category==mat.category && x.item==mat.item);
          if(mst.length>0){
          cp=mst[0]['cp'];
          cpAmount=Number(cp)*Number(mat.qty);
          }
          var data={
            clientId:element.clientId,
            clientLocationId:element.clientLocationId,
            id:element.srNo,
            type:(element.srNo.indexOf('I/C/')>-1 || element.srNo.indexOf('INV/CON')>-1) ?'Consumable':'Installation',
            billName:element.billName,
            billAddress:element.billAddress,
            accowner:accowner,
            userbranch:clientCity,
            billingbranch:element.billbranch,
            deliverybranch:element.branch,
            installAt:element.installAt,
            installAddress:element.installAddress,
            date: invDate.getDate() + ' ' + monthNames[invDate.getMonth()] + ' ' + invDate.getFullYear(),
            month:element.displaymonth,
            decRef:dc.srNo,
            taxType:element.taxType,
            material:mat.item,
            gst:mat.gst,
            hsnNo:mat.hsnNo,
            qty:mat.qty,
            rate:mat.rate.toString(),
            tax:mat.tax.toString(),
            amount:mat.amount.toString(),
            total:mat.totamount.toString(),
            received:element.recAmount,
            cp:cp,
            cpAmount:cpAmount,
            gstno:gstno,
            ponumber:element.ponumber,
            invNo:element.invNo,
            isDeleted:element.isDeleted
          }
          jsonArray.push(data);
        });
        dc['machineDetails']?.forEach(function(mat,minx){
          var data={
            clientId:element.clientId,
            clientLocationId:element.clientLocationId,
            id:element.srNo,
            type:(element.srNo.indexOf('I/M/')>-1 || element.srNo.indexOf('INV/Machine')>-1) ?'Installation':'Consumable',
            billName:element.billName,
            billAddress:element.billAddress,
            userbranch:clientCity,
            billingbranch:element.billbranch,
            deliverybranch:element.branch,
            installAt:element.installAt,
            installAddress:element.installAddress,
            date: invDate.getDate() + ' ' + monthNames[invDate.getMonth()] + ' ' + invDate.getFullYear(),
            month:element.displaymonth,
            decRef:dc.srNo,
            taxType:element.taxType,
            material:mat['machineType'],
            gst:"18%",
            hsnNo:mat['machinehsncode'],
            qty:mat['machineCount'],
            rate:"-",
            tax:(Number(mat['mchInstCharges'])*18/100),
            amount:mat['mchInstCharges'],
            total:(Number(mat['mchInstCharges'])+Number(mat['mchInstCharges'])*18/100),
          }
          jsonArray.push(data);
        });
      });
    }
});
  return jsonArray;
}

async downloadRentalInvoices(month:string){
  let billDetail=await this.salesService.getRateDetail();
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


  let spsnaps= await this.firebaseService.collection('client-sales-pipeline').snapshotChanges().pipe(first()).toPromise();
  let sptempDoc:ClientSalesPipeline[];
  sptempDoc=spsnaps.map((entry) => {
      var sl = <ClientSalesPipeline>{
        ...(entry.payload.doc.data() as {}),
      };
      sl['refId'] = entry.payload.doc.id;
      return sl;
    });
  var clientLocation=[];
  sptempDoc.forEach(element => {
    element.locations.forEach(loc=>{
      clientLocation.push({clientId:element.clientId,locationId:loc.id,location:loc.branchcity,accowner:loc.accowner});
    });
  });



var monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
  var jsonArray=[];
  tempDoc.forEach(function(element,index){
// if (element?.isDeleted == false
//   //&& element.displaymonth==month
//   )
if (element.billbranch!="Test")
  {
  element.machines.forEach(function(mch,index){
    var invDate = new Date(element.createdOn['seconds'] * 1000);
    var mast= billDetail.filter(x=>x.locationId==element.clientLocationId);
    let gst='';
    if(mast.length>0){
      gst=mast[0].gstno;
    }

    var arayclientCity=clientLocation.filter(x=>x.clientId==element.clientId && x.locationId==element.clientLocationId);
    var clientCity='';
		var accowner='';

    if(arayclientCity.length>0){
      clientCity=arayclientCity[0].location;
      accowner=arayclientCity[0].accowner;
    }

    var data={
      clientId:element.clientId,
      clientLocationId:element.clientLocationId,
      id:element.srNo,
      type:'Rental',
      billName:element.billName,
      billAddress:element.billAddress,
      accowner:accowner,
      userbranch:clientCity,
      billingbranch:element.billbranch,
      deliverybranch:element.branch,
      //deliverybranch:element?.bank?.length>0?element.bank[0].branch:'',
      installAt:element.installAt,
      installAddress:element.installAddress,
      date: invDate.getDate() + ' ' + monthNames[invDate.getMonth()] + ' ' + invDate.getFullYear(),
      month:element.displaymonth,
      machineName:mch.machineName,
      machinehsncode:mch.machinehsncode,
      machineCategory:mch.machineCategory,
      machineType:mch.machineType,
      machineCount:mch.machineCount,
      taxType:element.taxType,
      gst:'18%',
      amount:Number(mch.mchRent),
      tax:Number(mch.mchRent)*0.18,
      Total:(Number(mch.mchRent)+(Number(mch.mchRent)*0.18)).toString(),
      ponumber:element.poNumber,
      invNo:element.invNo,
      narration:element.narration,
      isDeleted:element.isDeleted
     }
    jsonArray.push(data);
  });




}
});
return jsonArray;
}

}

