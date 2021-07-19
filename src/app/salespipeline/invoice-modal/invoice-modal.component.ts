import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { BillingDetail, ClientSalesPipeline, DCDetailModel, DCMaterial, Invoice, InvoiceMonth, ReceiptBook } from '../salespipeline.model';
import {Platform} from '@ionic/angular'
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DivisionService } from 'src/app/services/division.service';
import { FormControl, Validators } from '@angular/forms';
import { SalespipelineService } from '../salespipeline.service';
import { MastBranch } from 'src/app/models/division.model';
@Component({
  selector: 'app-invoice-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.scss'],
})
export class InvoiceModalComponent{
  @Input() dclist: DCDetailModel[];
  @Input() months: InvoiceMonth[];
  _invoiceMonth=new FormControl('',Validators.required);
  _ponumber=new FormControl('',Validators.required);
  billingDetail:BillingDetail;
  salesDetail:ClientSalesPipeline;
  pdfObj = null;
  constructor(private modalCtrl:ModalController,
    private divisionService:DivisionService,
    private toastController: ToastController,
    private salespiplineService:SalespipelineService,
    private navCtrl: NavController,
    ) {
  }
  dismissModal() {
    this.modalCtrl.dismiss({status:"canceled"});
  }
  async generateInvoice(){
   if(!this._invoiceMonth.value){
    this.toastController
    .create({
      message: 'Please select invoice month.',
      duration: 2000,
      color: 'danger',
    })
    .then((tost) => {
      tost.present();
    });
     return;
   }


    let result = this.dclist;

    let req: any=[];
      req = JSON.parse(JSON.stringify(result[0]));
      this.billingDetail=await this.salespiplineService.getMastRateByLocation(req.locationId);
      for (let i = 1; i < result.length; i++) {
        result[i].materialDetails.forEach((element) => {
          req.materialDetails.push(Object.assign({},element));
        });
      }

      let mergemat = this.mergeMaterials(req['materialDetails']);
      let amt=0; let tax=0; let totamt=0; let addhocAmount=0;
      mergemat.materials.forEach((m, index) => {
        let mat = [];
        amt = amt + Number(m['amount'].toFixed(2));
        tax = tax + Number(m['tax'].toFixed(2));
      });
      totamt = amt + tax;
     let machineData=await this.getMachineDetails(req);
     this.insertInvoice(req, this.dclist, amt, tax, totamt,this.billingDetail.taxType,machineData);

    }
  mergeMaterials(materials:DCMaterial[]):any{
    var data={
      materials:[],
      hsn:[]
    }
  materials.forEach(material => {
    let entry=data.materials.filter(m=>m.item==material.item && m.category==material.category && m.hsnNo==material.hsnNo);
    if(entry.length>0){
      entry[0].qty=entry[0].qty+material.qty;
      entry[0].amount=entry[0].amount+material.amount;
      entry[0].tax=entry[0].tax+material.tax;
      entry[0].totamount=entry[0].totamount+material.totamount;
    }
    else{
      data.materials.push(Object.assign({},material));
    }

    let entryhsn=data.hsn.filter(m=>m.hsnNo==material.hsnNo);
    if(entryhsn.length>0){
      entryhsn[0].amount=entryhsn[0].amount+material.amount;
      entryhsn[0].tax=entryhsn[0].tax+material.tax;
      entryhsn[0].totamount=entryhsn[0].totamount+material.totamount;
    }
    else{
      data.hsn.push(Object.assign({},material));
    }


  });
  return data;
  }
  async insertInvoice(req:DCDetailModel,selectedDC:DCDetailModel[],amt:number,tax:number,totamount:number,taxType:string,machines:any){
    let branch: MastBranch = await(await this.divisionService.getBrancheByName(req['branch']))[0];
    //let billDetail:BillingDetail= await(await this.salespiplineService.getBillingDetail(req['salesId'],req['locationId']));
    let imonth=this.months.filter(x=>x.id==this._invoiceMonth.value)[0];
    let ponumber=this._ponumber.value;
    let receiptBook=new ReceiptBook();
    receiptBook.category="INV";
    receiptBook.type="CON";
    receiptBook.branch=branch.initials;
    receiptBook.year=new Date('01-'+imonth.displaymonth).getFullYear();
    let receiptNo=await this.salespiplineService.getlastReceiptNumber(receiptBook);
    if(receiptNo!=null){
      receiptBook.id=receiptNo.id;
      receiptBook.srnumber = receiptNo.srnumber + 1;
    }
    else{
      receiptBook.srnumber=1;
      receiptBook.id=null;
    }
    let srNo=await this.padLeadingZeros(receiptBook.srnumber,6);
    let invoice = new Invoice();
    invoice.srNo=`${receiptBook.category}/${receiptBook.type}/${branch.initials}/${receiptBook.year}/${srNo}`;
    invoice.month=imonth.month;
    invoice.ponumber=ponumber;
    invoice.displaymonth=imonth.displaymonth;
    invoice.clientId=req.clientId;
    invoice.branch=branch.name;
    invoice.clientName=req.billName;
    invoice.bank=this.billingDetail.bank;
    invoice.clientLocationId=req.locationId;
    invoice.clientLocation=req.location;
    invoice.taxType=taxType;
    invoice.amount=amt;
    invoice.tax=tax;
    invoice.totamount=totamount;
    invoice.dcIds=selectedDC.map(x=>x.id).filter((value, index, self) => self.indexOf(value) === index).sort();
    invoice.dc=selectedDC;
    invoice.mchRent=machines.mchRent,
    invoice.mchdeposite=machines.mchdeposite,
    invoice.mchinstCharges=machines.mchinstCharges,
    invoice.consumableCap=machines.consumableCap;
    invoice.machines=machines.machineDetail;
    invoice.status="Created";
    invoice.billName=this.billingDetail.billName;
    invoice.billAddress=this.billingDetail.billAddress;
    invoice.installAt=this.billingDetail.installAt;
    invoice.installAddress=this.billingDetail.installAddress;
    let counter:number=0;
    this.salespiplineService.addupdateInvoice(invoice,false)
    .subscribe((res) => {
      this.updateDC(req,invoice);
      this.updateReceiptBook(receiptBook);
    });
  }
  updateDC(req:any,invoice:Invoice){
    invoice.dcIds.forEach(element => {
      this.salespiplineService.addupdateDC({isUsed:true,id:element},true)
      .subscribe((res) => {
        this.toastController.create({
            message: 'Invoice generated',
            duration: 2000,
            color: 'success',
          })
          .then((tost) => {
            this.modalCtrl.dismiss({status:"invoice generated"});
            this.navCtrl.navigateBack(`/salespipeline/invoicelist/${req.locationId}`);
          });
      });
    });
  }
  updateReceiptBook(receipt:ReceiptBook){
    this.salespiplineService.addupdateReceiptBook(receipt,receipt.id==null?false:true).subscribe()
  }
 async getMachineDetails(req){
  this.salesDetail=await this.salespiplineService.getSalesPiplineById(req.salesId);
  let loc=this.salesDetail.locations.filter(x=>x.id==req.locationId);
  if(loc.length>0){
    let rental:number=0;let deposite:number=0;let instCharges:number=0;let consumableCap:number=0;
    loc[0].machines.forEach(element => {
      rental=Number(rental)+Number(element.mchRent);
      deposite=Number(deposite)+Number(element.mchSecDeposite);
      instCharges = Number(instCharges) + Number(element.mchInstCharges),
      consumableCap = Number(consumableCap) + Number(element.consumableCap)
    });
 let machineData={
  mchRent:rental,
  mchdeposite:deposite,
  mchinstCharges:instCharges,
  consumableCap:consumableCap,
  machineDetail:loc[0].machines
}
return machineData;
}
  return null;
}

async  padLeadingZeros(num, size) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return await s;
}

}

