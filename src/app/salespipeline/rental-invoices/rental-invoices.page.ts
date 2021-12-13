import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MastBranch } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { ConvertDateToMMMYYYY, convertTimeStampToDate, getActiveYear } from 'src/app/utilities/dataconverters';
import { ClientSalesPipeline, DCMaterial, InvoiceMonth, ReceiptBook, RentalInvoice,Location, BillingDetail, BillingRate, GSTReceiptBook, Machine } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';
import { DatePipe } from '@angular/common';
import {AlertController, Platform, ToastController} from '@ionic/angular'
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { SlowBuffer } from 'buffer';
import * as converter from 'number-to-words';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ReportService } from 'src/app/services/report.service';

pdfMake.vfs=pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-rental-invoices',
  templateUrl: './rental-invoices.page.html',
  styleUrls: ['./rental-invoices.page.scss'],
})
export class RentalInvoicesPage implements OnInit {
  invoiceMonth:InvoiceMonth[]=[];
  sales:ClientSalesPipeline[]=[];
  filtersales:ClientSalesPipeline[]=[];
  rentInvoices:RentalInvoice[]=[];
  filterinvoicelist:RentalInvoice[];
  _invoiceMonth:any ;
  _invoiceDate:any;

  isLoading:boolean=true;
  billingDetail: BillingDetail;
  pdfObj=null;
  invoiceAmount:number=0;
  invoiceTax:number=0;
  invoiceTotal:number=0;
  invoiceCount:number=0;
  months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  @ViewChild('searchElement') searchElement;
  constructor(private salesService: SalespipelineService,private divisionService:DivisionService,
    private datePipe:DatePipe,
    private route: ActivatedRoute,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,  private router: Router,
    private toastController: ToastController,
    private reportService:ReportService,
    private alertCtrl:AlertController) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {

    this.isLoading=true;
    await this.loadMonths();
    this.isLoading=false;

   this._invoiceMonth = new FormControl(this.invoiceMonth[0].id, Validators.required);
    await this.doRefresh(this.invoiceMonth[0].displaymonth);
  }
async onChangeMonth(event){
let displayMonth = this.invoiceMonth.filter(
  (x) => x.id == this._invoiceMonth.value
)[0].displaymonth;
await this.doRefresh(displayMonth);
}
async loadMonths(){
  this.invoiceMonth=await this.salesService.getInvoiceMonth();
 }

 async loadsalespipelines(month:string){
  this.sales=[];
 let sp=await this.salesService.getSalesPipline();
 sp.forEach(client => {
  client['isChecked']=false;
   let isadd:boolean=false;
  client.locations.forEach(location => {
    if(location.currentStatus=='S7 : Win'){
      isadd=true;
    }
  });
  if(isadd){
    this.sales.push(client);
  }
 });
 }

 async loadrentalInvoices(month:string){
 this.rentInvoices=[];
 this.rentInvoices=await this.salesService.getRentalInvoice(null,null,month);
}

 async doRefresh(month){
  this.invoiceAmount= 0;
  this.invoiceTax= 0;
  this.invoiceTotal= 0;
  this.invoiceCount= 0;
   await this.loadsalespipelines(month);
  //let displayMonth = this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth;

   await this.loadrentalInvoices(month);






  this.sales.forEach(client => {
  let isClientDisplay=false;
   client.locations.forEach(location => {
    let islocationDisplay= this.validateClosureDate(location);
    if(!isClientDisplay && islocationDisplay)
    isClientDisplay=true;
    location['islocationDisplay']=islocationDisplay;
    location["invExist"]=false;
    location["rentalInvoice"]=[];
    location['poNumber']=new FormControl(null);
    location["invoiceDate"]= new Date();
    location['narration']=new FormControl('for the Month of '+this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth);
    location["closureDate"]=convertTimeStampToDate(location["closureDate"]);
    let rentinv= this.rentInvoices.filter(x=>x.clientId==client.clientId && x.clientLocationId==location.id)
   if(rentinv.length>0){
    location["invExist"]=true;
    location["rentalInvoice"]=rentinv;
    location['poNumber']=new FormControl(rentinv[0].poNumber);
    location['narration']=new FormControl(rentinv[0].narration?rentinv[0].narration:'for the Month of '+this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth);
   }
   if(location["invExist"]){
    location["invoiceDate"] =new FormControl(convertTimeStampToDate(location["rentalInvoice"][0].createdOn).toISOString(), Validators.required);
  }
  else{
    location["invoiceDate"]= new FormControl(new Date().toISOString(), Validators.required);
  }
   //this.invoiceCount= this.filterinvoicelist.length;
  });
  client["isClientDisplay"]=isClientDisplay;
  });






  this.filtersales=this.sales;







 }
getInvoiceDate(loc){

}

 async generateInvoice(rentInvoice:RentalInvoice[],loc:Location){
  let rentInv= await this.salesService.getRentalInvoice(rentInvoice[0].clientId,rentInvoice[0].clientLocationId,rentInvoice[0].displaymonth);
  let req=JSON.parse(JSON.stringify(rentInvoice[0]));
  let invoice=rentInv[0];
  let taxType=invoice.taxType;
  let rentSrNo=invoice.invNo? invoice.invNo:invoice.srNo;
  let branch: MastBranch = await(
  await this.divisionService.getBrancheByName(req['billbranch']))[0];
  let billingDetail = await this.salesService.getMastRateByLocation(req['clientLocationId']);



  let mgstNo:string='';
  if(billingDetail)
 {
  mgstNo=billingDetail['gstno'];
 }


 let sigReq=true;
 let _clientExceptions=await this.divisionService.getClientExceptions();
 let exres=_clientExceptions.filter(x=>x.clientId==invoice.clientId);
 if(exres.length>0){
   sigReq=exres[0].reqsignature;
 }

  let invDate=convertTimeStampToDate(invoice.createdOn);

  let demodata = {
    logo: this.getBase64Image(),
    authSignature:this.getAuthSignature(sigReq),
    clientaddress: `Consignee (Ship to)\n${invoice['installAt']}\n${invoice['installAddress']}\nGST No:${mgstNo}`,
    buyeraddress: `Buyer (Bill to)\n${invoice['billName']}\n${invoice['billAddress']}\nGST No:${mgstNo}`,
    reqId: req['id'],
    date: invDate,
  };

  var docDefinition = {
    // pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [10, 10, 10, 10],
    content: [
      {
        style: 'tableExample',
        color: '#444',
        margin: [0, 0, 0, 0],
        alignment: 'justify',
        table: {
          widths: [
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
          ],
          headerRows: 0,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: 'Tax Invoice',
                fontSize: 24,
                bold: true,
                colSpan: 8,
                alignment: 'center',
                // margin: [0, 0, 0, 0],
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: '#'+invoice.poNumber,
                fontSize: 14,
                bold: true,
                colSpan: 8,
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
                // margin: [0, 0, 0, 0],
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { image: demodata.logo, width: 75, height: 75, rowSpan: 3 },
              {
                colSpan: 3,
                rowSpan: 3,
                bold: true,
                fontSize: 10,
                text: `Dwija Foods Private Limited\n${branch.address}\n${
                  branch.gstno != '' ? 'GSTIN/UIN:' + branch.gstno : ''
                }\n${branch.state != '' ? 'State:' + branch.state : ''} ${
                  branch.code != '' ? 'Code:' + branch.code : ''
                }\n${branch.cin != '' ? 'CIN:' + branch.cin : ''}`,
              },
              '',
              '',
              {
                colSpan: 2,
                text: `Invoice No.:\n`+rentSrNo,
                fontSize: 8,
              },
              '',
              {
                colSpan: 2,
                text: `Dated.:\n${this.datePipe.transform(new Date(demodata.date), 'dd-MMM-yy')}`,
                fontSize: 8,
              },
              '',
            ],
            [
              '',
              '',
              '',
              '',
              {
                colSpan: 2,
                text: `Delivery Note.:`,
                fontSize: 8,
              },
              '',
              {
                colSpan: 2,
                text: `Mode/Terms of Payment:\n30 Days`,
                fontSize: 8,
              },
              '',
            ],
            [
              '',
              '',
              '',
              '',
              {
                colSpan: 2,
                text: `Reference No. & Date.:`,
                fontSize: 8,
              },
              '',
              {
                colSpan: 2,
                text: `Other References.:`,
                fontSize: 8,
              },
              '',
            ],
            [
              {
                colSpan: 4,
                rowSpan: 3,
                bold: true,
                fontSize: 8,
                text: demodata.clientaddress,
              },
              '',
              '',
              '',
              {
                colSpan: 2,
                text: `Buyer's Order No..:`,
                fontSize: 8,
              },
              '',
              {
                colSpan: 2,
                text: `Dated.:`,
                fontSize: 8,
              },
              '',
            ],
            [
              '',
              '',
              '',
              '',
              {
                colSpan: 2,
                text: `Dispatch Doc No.:`,
                fontSize: 8,
              },
              '',
              {
                colSpan: 2,
                text: `Delivery Note Date:`,
                fontSize: 8,
              },
              '',
            ],
            [
              '',
              '',
              '',
              '',
              {
                colSpan: 2,
                text: `Dispatched through.:`,
                fontSize: 8,
              },
              '',
              {
                colSpan: 2,
                text: `Destination.:`,
                fontSize: 8,
              },
              '',
            ],
            [
              {
                colSpan: 4,
                bold: true,
                fontSize: 8,
                text: demodata.buyeraddress,
              },
              '',
              '',
              '',
              {
                colSpan: 4,
                text: `Terms of Delivery:`,
                fontSize: 8,
              },
              '',
              '',
              '',
            ],
            [
              {
                colSpan: 8,
                style: 'tableExample',
                // layout: 'headerLineOnly',
                table: {
                  headerRows: 1,
                  widths: ['*', 150, '*', '*', '*', '*', '*', 75],
                  body: [
                    [
                      {
                        fontSize: 8,
                        text: 'Sl No.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'Description of Machine.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'HSN/SAC.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'GST Rate.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'Quantity.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'Rate.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'per.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                      {
                        fontSize: 8,
                        text: 'Amount.',
                        borderColor: [
                          '#000000',
                          '#000000',
                          '#000000',
                          '#000000',
                        ],
                      },
                    ],
                  ],
                },
                layout1: {
                  hLineWidth: function (i, node) {
                    return i != 1 ? 0 : 1;
                  },
                  vLineWidth: function (i, node) {
                    return i === 0 || i === node.table.widths.length ? 0 : 1;
                  },
                  hLineColor: function (i, node) {
                    return i === 0 || i === node.table.body.length
                      ? 'black'
                      : 'gray';
                  },
                  vLineColor: function (i, node) {
                    return i === 0 || i === node.table.widths.length
                      ? 'black'
                      : 'gray';
                  },
                  // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                  // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                  // paddingLeft: function(i, node) { return 4; },
                  // paddingRight: function(i, node) { return 4; },
                  // paddingTop: function(i, node) { return 2; },
                  // paddingBottom: function(i, node) { return 2; },
                },
              },
              '',
              '',
              '',
              '',
              '',
              '',
              '',
            ],
          ],
        },
      },
    ],
  };

  let ainx=8;
  if(invoice.poNumber){
    ainx=9;
  }
  else{
    docDefinition.content[0].table.body.splice(1, 1);
  }

  let amt = 0;
  let tax = 0;
  let totamt = 0;
  let cgsttax=0;
  let sgsttax=0;

  let subtable = docDefinition.content[0].table.body[ainx][0]['table'];


  let mergemat = this.mergeMachines(rentInv[0].machines,true);

  mergemat.materials.forEach((m, index) => {
    let mat = [];
    let gst=Number(m['gst'].replace('%',''));
    amt = amt + Number(m['amount'].toFixed(2));
    tax = tax+ Number(m['tax'].toFixed(2));
    cgsttax =cgsttax + Number(m['amount'].toFixed(2)) * ((gst/2) /100);
    sgsttax =sgsttax + Number(m['amount'].toFixed(2))  * ((gst/2) /100);
    mat.push(
      {
        text: index + 1,
        fontSize: 8,
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: 'Machine Rental ', //m['category'],
        fontSize: 8,
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: m['hsnNo'],
        fontSize: 8,
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: m['gst'],
        fontSize: 8,
        alignment: 'right',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: m['qty'] + ' ' + m['uom'],
        fontSize: 8,
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: m['rate'],
        fontSize: 8,
        alignment: 'right',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: m['uom'],
        fontSize: 8,
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: m['amount'].toFixed(2),
        fontSize: 8,
        alignment: 'right',
        borderColor:
          mergemat.materials.length - 1 == index
            ? ['#000000', '#ffffff', '#000000', '#707070']
            : ['#000000', '#ffffff', '#000000', '#ffffff'],
      }
    );
    subtable.body.push(mat);
  });
  totamt = amt + tax;
  //Total
  subtable.body.push([
    {
      text:'',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      //text: `Rental for ${this.datePipe.transform(new Date(demodata.date), 'MMM-yyyy')}`,
      text: invoice.narration?invoice.narration:loc['narration'].value,
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: amt.toFixed(2),
      alignment: 'right',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
  ]);
  //Empty Row
  subtable.body.push([
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
  ]);
  //IGST Payable
  if(taxType.trim()=="IGST"){
  subtable.body.push([
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: 'IGST Payable',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: tax.toFixed(2),
      alignment: 'right',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
  ]);
}
else if(taxType=="CGST/SGST"){
  subtable.body.push([
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: 'CGST Payable',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: (amt*0.09).toFixed(2),
      alignment: 'right',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
  ]);
  subtable.body.push([
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: 'SGST Payable',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: '',
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    {
      text: (amt*0.09).toFixed(2),
      alignment: 'right',
      fontSize: 10,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
  ]);
}




  let totrows = 25;
  totrows =
    totrows < subtable.body.length
      ? subtable.body.length
      : totrows - subtable.body.length;
  for (let i = 0; i <= totrows; i++) {
    subtable.body.push([
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
    ]);
  }

//Total Payable
subtable.body.push([
  '',
  '',
  '',
  '',
  '',
  '',
  {
    text:'round-off',
    fontSize: 8,
  },
  {
    text:(Math.round(amt + tax) - (amt + tax)).toFixed(2),
    fontSize: 8,
    bold: true,
    alignment: 'right',
  },
]);


  //Total round off Payable
  let totroundoff=Math.round(amt + tax);
  subtable.body.push([
    '',
    'Total',
    '',
    '',
    '',
    '',
    '',
    {
      text: '₹ ' + totroundoff,
      fontSize: 10,
      bold: true,
      alignment: 'right',
    },
  ]);

  let table: any = docDefinition.content[0].table;
  table.body.push([
    {
      text: 'Amount Chargeable (in words)',
      colSpan: 7,
      fontSize: 10,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    '',
    '',
    '',
    '',
    '',
    {
      text: 'E. & O.E',
      fontSize: 10,
      borderColor: ['#ffffff', '#000000', '#000000', '#ffffff'],
    } as unknown,
  ]);
  table.body.push([
    {
      text: 'INR ' + converter.toWords(totroundoff).toUpperCase() + ' ONLY',
      colSpan: 8,
      bold: true,
      fontSize: 10,
      borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
    } as unknown,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  //Inset tax table later
  let taxtable: any =[];
  if(taxType.trim()=="IGST"){
    taxtable = [
      {
        colSpan: 8,
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: [150, '*', '*', '*', '*'],
          body: [
            [
              {
                fontSize: 8,
                text: 'HSN/SAC.',
                alignment: 'center',
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Taxable Value',
                alignment: 'center',
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Taxable Integrated Tax',
                alignment: 'center',
                colSpan: 2,
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              '',
              {
                fontSize: 8,
                text: 'Total Tax Amount',
                alignment: 'center',
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
            ],
            [
              {
                fontSize: 8,
                text: '',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: '',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Rate',
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Amount',
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: '',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
            ],
          ],
        },
      },
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    table.body.push(taxtable);
    if (mergemat.hsn.length > 0) {
      let tothsn = new DCMaterial();
      tothsn.hsnNo = 'Total';
      tothsn.amount = amt;
      tothsn.tax = tax;
      tothsn.totamount = amt + tax;
      mergemat.hsn.push(tothsn);
    }
    for (let i = 0; i < mergemat.hsn.length; i++) {
      let nbold: boolean = false;
      if (i == mergemat.hsn.length - 1) {
        nbold = true;
      }
      taxtable[0].table.body.push([
        {
          fontSize: 8,
          text: mergemat.hsn[i].hsnNo,
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          bold: nbold,
        },
        {
          fontSize: 8,
          text: mergemat.hsn[i].amount.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: mergemat.hsn[i].gst,
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: mergemat.hsn[i].tax.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: mergemat.hsn[i].tax.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
      ]);
    }
  }
  else if(taxType=="CGST/SGST"){
    taxtable = [
      {
        colSpan: 8,
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: [150, '*', '*', '*', '*','*','*'],
          body: [
            [
              {
                fontSize: 8,
                text: 'HSN/SAC.',
                alignment: 'center',
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Taxable Value',
                alignment: 'center',
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Central Tax',
                alignment: 'center',
                colSpan: 2,
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              '',
              {
                fontSize: 8,
                text: 'State Tax',
                alignment: 'center',
                colSpan: 2,
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
              '',
              {
                fontSize: 8,
                text: 'Total Tax Amount',
                alignment: 'center',
                borderColor: ['#000000', '#000000', '#000000', '#000000'],
              },
            ],
            [
              {
                fontSize: 8,
                text: '',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: '',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Rate',
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Amount',
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Rate',
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: 'Amount',
                alignment: 'center',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
              {
                fontSize: 8,
                text: '',
                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
              },
            ],
          ],
        },
      },
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    table.body.push(taxtable);
    if (mergemat.hsn.length > 0) {
      let tothsn = new DCMaterial();
      tothsn.hsnNo = 'Total';
      tothsn.amount = amt;
      tothsn.tax = tax;
      tothsn.totamount = amt + tax;
      mergemat.hsn.push(tothsn);
    }
    for (let i = 0; i < mergemat.hsn.length; i++) {
      let ngst=mergemat.hsn[i].gst?mergemat.hsn[i].gst.replace('%',''):'';


      let nbold: boolean = false;
      if (i == mergemat.hsn.length - 1) {
        nbold = true;
      }
      taxtable[0].table.body.push([
        {
          fontSize: 8,
          text: mergemat.hsn[i].hsnNo,
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          bold: nbold,
        },
        {
          fontSize: 8,
          text: mergemat.hsn[i].amount.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: ngst!=''? (Number(ngst)/2).toFixed(2):'',
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: ngst!=''? (mergemat.hsn[i].amount * Number(ngst)/2/100).toFixed(2):cgsttax.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: ngst!=''?(Number(ngst)/2).toFixed(2):'',
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: ngst!=''? (mergemat.hsn[i].amount * Number(ngst)/2/100).toFixed(2):sgsttax.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
        {
          fontSize: 8,
          text: mergemat.hsn[i].tax.toFixed(2),
          borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
          alignment: 'right',
          bold: nbold,
        },
      ]);
    }
  }






  table.body.push([
    {
      text: 'Tax Amount (in words) :',
      fontSize: 10,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    } as unknown,
    {
      text: 'INR ' + converter.toWords(tax).toUpperCase() + ' ONLY',
      colSpan: 7,
      fontSize: 10,
      bold: true,
      borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
    },
    '',
    '',
    '',
    '',
    '',
  ]);

  table.body.push([
    {
      text: '',
      fontSize: 10,
      colSpan: 3,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    '',
    {
      text: 'Companys Bank Details:',
      fontSize: 10,
      colSpan: 5,
      borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
    } as unknown,
    '',
    '',
    '',
    '',
  ]);
  table.body.push([
    { text: '', colSpan: 3 },
    '',
    '',
    {
      text: 'Bank Name:',
      fontSize: 10,
      colSpan: 3,
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    } as unknown,
    '',
    '',
    {
      text: invoice.bank.name,
      fontSize: 10,
      colSpan: 2,
      bold: true,
      borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
    },
    '',
  ]);
  table.body.push([
    {
      text: '',
      colSpan: 3,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    '',
    {
      text: 'A/c No.',
      fontSize: 10,
      colSpan: 3,
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    '',
    {
      text: invoice.bank.accno,
      fontSize: 10,
      colSpan: 2,
      bold: true,
      borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
    } as unknown,
    '',
  ]);

  table.body.push([
    {
      text: 'Company PAN:',
      fontSize: 10,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    } as unknown,
    {
      text: branch.pan,
      fontSize: 10,
      colSpan: 2,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    {
      text: 'Branch & IFS Code:',
      fontSize: 10,
      colSpan: 3,
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#000000'],
    },
    '',
    '',
    {
      text: invoice.bank.branch + '&' + invoice.bank.ifsc,
      fontSize: 10,
      colSpan: 2,
      borderColor: ['#ffffff', '#ffffff', '#000000', '#000000'],
    },
    '',
  ]);
  table.body.push([
    {
      text: 'Declaration',
      fontSize: 10,
      colSpan: 3,
      bold: true,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    },
    '',
    '',
    {
      text: 'for Dwija Foods Private Limited',
      fontSize: 10,
      colSpan: 5,
      alignment: 'right',
      bold: true,
      borderColor: ['#000000', '#000000', '#000000', '#ffffff'],
    } as unknown,
    '',
    '',
    '',
    '',
  ]);
  table.body.push([
    {
      text: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
      fontSize: 10,
      colSpan: 3,
      borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
    } as unknown,
    '',
    '',
    {
      text: '',
      colSpan: 4,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    '',
    '',
    { image: demodata.authSignature, width: 100, height: 50, borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff']},
  ]);
  table.body.push([
    {
      text: '',
      colSpan: 3,
      borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
    },
    '',
    '',
    {
      text: 'Authorised Signatory',
      fontSize: 10,
      alignment: 'right',
      colSpan: 5,
      borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
    } as unknown,
    '',
    '',
    '',
    '',
  ]);

  table.body.push([
    {
      text: 'FSSAI Regn. No. 11520009000262',
      fontSize: 8,
      alignment: 'center',
      colSpan: 8,
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    } as unknown,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);



  this.pdfObj = pdfMake.createPdf(docDefinition);
  if (this.plt.is('cordova')) {
    this.pdfObj.getBuffer((buffer) => {
      var utf8 = new Uint8Array(buffer);
      var binaryArray = utf8.buffer;
      var blob = new Blob([binaryArray], { type: 'application/pdf' });
      this.file
        .writeFile(this.file.dataDirectory, `${req['id']}.pdf`, blob, {
          replace: true,
        })
        .then((fileEntry) => {
          this.fileOpener
            .open(
              this.file.dataDirectory + `${req['id']}.pdf`,
              'application/pdf'
            )
            .then(() => console.log('File is opened'))
            .catch((e) => console.log('Error opening file', e));
        });
    });
  } else {
    this.pdfObj.download();
  }
}
 async createInvoice(location:Location,sales:ClientSalesPipeline,rentalInvoice:any){
  let displayMonth = this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth;
  let rentInv= await this.salesService.getRentalInvoice(sales.clientId,location.id,displayMonth);
   if(rentInv.length>0){
    rentalInvoice[0]=rentInv;
    return;
   }
  let branchs: MastBranch[] = await(await this.divisionService.getBrancheByName(location.branch));
  let branch:MastBranch;
  let mchDetail=await this.getMachineDetails(sales.id,location.id,location['invoiceDate'].value);
  this.billingDetail = await this.salesService.getMastRateByLocation(location.id);

  if(branchs.length<=0){
    this.toastController
    .create({
      message: 'Branch not defined',
      duration: 2000,
      color: 'danger',
    })
    .then((tost) => {
      tost.present();
    });
    return;
  }
  if(!this.billingDetail){
    this.toastController
    .create({
      message: 'Please update Billing Rate options',
      duration: 2000,
      color: 'danger',
    })
    .then((tost) => {
      tost.present();
    });
    return;
  }
  branch=branchs[0];

  let billfrombranch= '';
    billfrombranch=this.billingDetail.branch?this.billingDetail.branch:branch.name;



  let rentSrNo:string="";
    let receiptBook=new ReceiptBook();
    receiptBook.category="I";
    receiptBook.type="R";
    receiptBook.branch=branch.initials;
    //receiptBook.year=new Date('01-'+displayMonth).getFullYear();
     receiptBook.year=getActiveYear();
    let receiptNo=await this.salesService.getlastReceiptNumber(receiptBook);
    if(receiptNo!=null){
      receiptBook.id=receiptNo.id;
      receiptBook.srnumber = receiptNo.srnumber + 1;
    }
    else{
      receiptBook.srnumber=1;
      receiptBook.id=null;
    }


    let srNo=await this.padLeadingZeros(receiptBook.srnumber,5);

    let rentinvoice = new RentalInvoice();
    rentinvoice.srNo=`${receiptBook.category}/${receiptBook.type}/${branch.initials}/${receiptBook.year}/${srNo}`;

    //New invoice series
    let gstreceiptBook=await this.getGSTSrNoRental(billfrombranch);
    let gstsrNo=await this.padLeadingZeros(gstreceiptBook.srnumber,4);
    rentinvoice.invNo=`${gstreceiptBook.branch}/${gstreceiptBook.category}/${gstreceiptBook.type}/${Number(gstreceiptBook.year-2000) + "" + Number(gstreceiptBook.year+1-2000)}/${gstsrNo}`;



    rentSrNo=rentinvoice.srNo;
    rentinvoice.month=new Date('01-'+displayMonth+'-'+ new Date().getFullYear());
    rentinvoice.displaymonth=displayMonth;
    rentinvoice.clientId=sales.clientId;
    rentinvoice.branch=branch.name;
    rentinvoice.billbranch=billfrombranch;
    rentinvoice.clientName=sales.client;
    rentinvoice.clientLocationId=location.id;
    rentinvoice.clientLocation=location.city;
    rentinvoice.bank=this.billingDetail.bank;
    rentinvoice.taxType=this.billingDetail.taxType;
    rentinvoice.mchRent=mchDetail.mchRent;
    rentinvoice.mchdeposite=mchDetail.mchdeposite;
    rentinvoice.mchinstCharges=mchDetail.mchinstCharges;
    rentinvoice.consumableCap=mchDetail.consumableCap;
    rentinvoice.machines=mchDetail.machineDetail;
    rentinvoice.status="Created";
    rentinvoice.billName=this.billingDetail.billName;
    rentinvoice.billAddress=this.billingDetail.billAddress;
    rentinvoice.installAt=this.billingDetail.installAt;


    rentinvoice.installAddress=this.billingDetail.installAddress;
    rentinvoice.createdOn = new Date(location['invoiceDate'].value);
    rentinvoice.poNumber=location['poNumber'].value;
    rentinvoice.narration=location['narration'].value;
    rentinvoice.modifiedOn=new Date();
    rentinvoice.displaymonth=displayMonth;
    rentalInvoice.push(rentinvoice);
    location['invExist']=true;
    let counter:number=0;
    this.salesService.addupdateRentalInvoice(rentinvoice,false)
    .subscribe((res) => {
      this.updateReceiptBook(receiptBook);
      this.updateGSTReceiptBook(gstreceiptBook);

    });
}
async getGSTSrNoRental(billbranch:string){
  let branchs: MastBranch[] = await(await this.divisionService.getBrancheByName(billbranch));
  let receiptBook=new GSTReceiptBook();
  receiptBook.category="I";
  receiptBook.type="R";
  receiptBook.branch=branchs[0].initials;
  //receiptBook.year=Number((getActiveYear()-2000)+''+(getActiveYear()+1-2000));
  receiptBook.year=getActiveYear();
  let receiptNo=await this.salesService.getlastGSTReceiptNumber(receiptBook);
  if(receiptNo!=null){
    receiptBook.id=receiptNo.id;
    receiptBook.srnumber = receiptNo.srnumber + 1;
  }
  else{
    receiptBook.srnumber=1;
    receiptBook.id=null;
  }
   return receiptBook;
}


async  updateInvoice (invoice:RentalInvoice[],saleId:string,loc:any){
  let displayMonth = this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth;
  invoice= await this.salesService.getRentalInvoice(invoice[0].clientId,invoice[0].clientLocationId,invoice [0].displaymonth);
  let rentInvoice=invoice[0];
  let _rinvdate=loc['invoiceDate'].value;
  _rinvdate=_rinvdate.toString();
  let branch:MastBranch= await(await this.divisionService.getBrancheByName(rentInvoice.branch))[0];
  let mchDetail=await this.getMachineDetails(saleId,rentInvoice.clientLocationId,_rinvdate);
  this.billingDetail = await this.salesService.getMastRateByLocation(rentInvoice.clientLocationId);

  let billfrombranch= '';
    billfrombranch=this.billingDetail.branch?this.billingDetail.branch:branch.name;


  rentInvoice.createdOn=new Date(loc['invoiceDate'].value);
    rentInvoice.poNumber=loc['poNumber'].value;
    rentInvoice.narration=loc['narration'].value;
    //rentInvoice.displaymonth=this.datePipe.transform(rentInvoice.createdOn, 'MMM-yyyy');
    rentInvoice.displaymonth=displayMonth;
    rentInvoice.srNo=rentInvoice.srNo;
    rentInvoice.branch=branch.name;
    rentInvoice.billbranch=billfrombranch;
    rentInvoice.billName=this.billingDetail.billName;
    rentInvoice.billAddress=this.billingDetail.billAddress;
    rentInvoice.installAt=this.billingDetail.installAt;
    rentInvoice.installAddress=this.billingDetail.installAddress;
    rentInvoice.bank=this.billingDetail.bank;
    rentInvoice.taxType=this.billingDetail.taxType;
    rentInvoice.mchRent=mchDetail.mchRent;
    rentInvoice.mchdeposite=mchDetail.mchdeposite;
    rentInvoice.mchinstCharges=mchDetail.mchinstCharges;
    rentInvoice.consumableCap=mchDetail.consumableCap;
    rentInvoice.machines=mchDetail.machineDetail;
    rentInvoice.billName=this.billingDetail.billName;
    rentInvoice.billAddress=this.billingDetail.billAddress;
    rentInvoice.installAt=this.billingDetail.installAt;
    rentInvoice.installAddress=this.billingDetail.installAddress;
    this.salesService.addupdateRentalInvoice(rentInvoice,true).subscribe((res) => {
      this.toastController
      .create({
        message: 'Data updated',
        duration: 2000,
        color: 'success',
      })
      .then((tost) => {
        tost.present();
      });
    });

}
async getMachineDetails(salesId,locationId,invDate) {
let _invDate=invDate;

  let mchDetail = await this.salesService.getSalesPiplineById(
    salesId
  );
  let loc = mchDetail.locations.filter((x) => x.id == locationId);
  if (loc.length > 0) {
    let rental: number = 0;
    let deposite: number = 0;
    let instCharges: number = 0;
    let consumableCap: number = 0;
    loc[0].machines.forEach((element) => {
      if(element.pulloutDate!=null && element.pulloutDate){
        let pdays= new Date(element.pulloutDate).getDate();
        let pMonth= new Date(element.pulloutDate).getMonth()+1;
        let pYear= new Date(element.pulloutDate).getFullYear();
        let iMonth= new Date(invDate).getMonth()+1;
        let iYear= new Date(invDate).getFullYear();
        if(iMonth>=pMonth && iYear>=pYear){
          //rental = Number(rental) + Number(element.mchRent)/30*pdays;
        }
        else{
          rental = Number(rental) + Number(element.mchRent);
          deposite = Number(deposite) + Number(element.mchSecDeposite);
          (instCharges = Number(instCharges) + Number(element.mchInstCharges)),
            (consumableCap =Number(consumableCap) + Number(element.consumableCap));
        }
      }
      else{
        rental = Number(rental) + Number(element.mchRent);
        deposite = Number(deposite) + Number(element.mchSecDeposite);
        (instCharges = Number(instCharges) + Number(element.mchInstCharges)),
          (consumableCap =Number(consumableCap) + Number(element.consumableCap));
      }
    });
    let machineData = {
      mchRent: rental,
      mchdeposite: deposite,
      mchinstCharges: instCharges,
      consumableCap: consumableCap,
      machineDetail: loc[0].machines.filter(x=>x.pulloutDate==null ||x.pulloutDate==undefined || (new Date(x.pulloutDate).getMonth() > new Date(invDate).getMonth() && new Date(x.pulloutDate).getFullYear() >= new Date(invDate).getFullYear())),
    };
    return machineData;
  }
  return null;
}
async deleteInvoice(rentInvoice:RentalInvoice[]){
  let rentInv= await this.salesService.getRentalInvoice(rentInvoice[0].clientId,rentInvoice[0].clientLocationId,rentInvoice[0].displaymonth);
  let invoice=rentInv[0];
  this.alertCtrl.create({
    header: 'Delete Invoice!',
    message:
      '<strong>Are you sure you want delete this invoice '+invoice.invNo? invoice.invNo:invoice.srNo+'?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Okay',
          handler:async (data) => {
             invoice.isDeleted=true;
            await this.salesService.deleteRentalInvoice(invoice).then(async x=>{
              const toast = await this.toastController.create({
                message:  invoice.invNo? invoice.invNo: invoice.srNo+ ' Invoice deleted',
                duration: 2000,
                color: 'success',
              });
              toast.present();
              let displayMonth = this.invoiceMonth.filter(
                (x) => x.id == this._invoiceMonth.value
              )[0].displaymonth;
              await this.doRefresh(displayMonth);
            });

          },
        },
      ],
    }).then((alertEl) => {
      alertEl.present();
    });







}

async onFilterUpdate(ev: any) {
  this.filtersales= await this.applyFilter();

  //this.invoiceCount= this.filterinvoicelist.length;
}

async applyFilter(){
  let serchTerm = this.searchElement.value;
  let filtersales: ClientSalesPipeline[] = [];
  this.sales.forEach((sp) => {
    if(sp.client.toLowerCase().indexOf(serchTerm.toLowerCase())> -1
    ) {
      sp['isChecked']=false;
      filtersales.push(sp);
    }
  });
  if(filtersales.length<=0 && serchTerm==""){
    this.rentInvoices.forEach((sp) => {
      sp['isChecked']=false;
    });
    return this.sales;
  }


  return filtersales;
}

 updateReceiptBook(receipt:ReceiptBook){
  this.salesService.addupdateReceiptBook(receipt,receipt.id==null?false:true).subscribe()
}

updateGSTReceiptBook(receipt:GSTReceiptBook){
  this.salesService.addupdateGSTReceiptBook(receipt,receipt.id==null?false:true).subscribe()
}



async  padLeadingZeros(num, size) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return await s;
}

mergeMachines(machines:any,isrent:boolean=false):any{
  var data={
    materials:[],
    hsn:[]
  }
  machines.forEach(machine => {
  let entry=data.materials.filter(m=>m.item==machine.machineName && m.category==machine.machineCategory && m.hsnNo==machine.machinehsncode);
  if(entry.length>0){
    entry[0].qty=entry[0].qty+Number(machine.machineCount);
    entry[0].amount=entry[0].amount+ + Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges);
    entry[0].tax=entry[0].tax+ Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges)*0.18;
    entry[0].totamount=entry[0].totamount+entry[0].amount+ entry[0].tax;
  }
  else{
    var mch:any=[];
    mch.category=machine.machineName;
    mch.item=machine.machineCategory;
    mch.hsnNo=machine.machinehsncode;
    mch.gst="18%",
    mch.uom="mch",
    mch.qty=Number(machine.machineCount),
    mch.rate=Number(isrent?machine.mchRent:machine.mchInstCharges),
    mch.qty=Number(machine.machineCount);
    mch.amount= Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges);
    mch.tax= Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges)*0.18;
    mch.totamount=mch.amount+ mch.tax;
    data.materials.push(Object.assign({},mch));
  }
  let entryhsn=data.hsn.filter(m=>m.hsnNo==machine.machinehsncode);
  if(entryhsn.length>0){
    entryhsn[0].amount=entryhsn[0].amount+ + Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges);
    entryhsn[0].tax=entryhsn[0].tax+ Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges)*0.18;
    entryhsn[0].totamount=entryhsn[0].totamount+entryhsn[0].amount+ entryhsn[0].tax;
  }
  else{
    var mch:any=[];
    mch.category=machine.machineName;
    mch.item=machine.machineCategory;
    mch.hsnNo=machine.machinehsncode;
    mch.gst="18%",
    mch.uom="machine",
    mch.amount= Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges);
    mch.tax= Number(machine.machineCount)*Number(isrent?machine.mchRent:machine.mchInstCharges)*0.18;
    mch.totamount=mch.amount+ mch.tax;
    data.hsn.push(Object.assign({},mch));
  }
});
return data;
}

chkInvoiceChange(event,sale){
  this.invoiceAmount= 0;
  this.invoiceTax= 0;
  this.invoiceTotal= 0;
  this.invoiceCount= 0;

  let rentSales=this.filtersales.filter(x=>x['isChecked']==true);
  rentSales.forEach(sale => {
  sale.locations.forEach(loc => {
    loc['rentalInvoice']?.forEach((inv,index) => {
      let mchRent= (isNaN(inv.mchRent)?0:inv.mchRent);
      this.invoiceAmount=this.invoiceAmount+mchRent;
      this.invoiceTax=this.invoiceTax+(mchRent*0.18);
      this.invoiceTotal=this.invoiceAmount+ this.invoiceTax;
      this.invoiceCount=this.invoiceCount+1;

    });
  });
});

  // if(invoice.isChecked){
  //   this.invoiceAmount=this.invoiceAmount+ invoice.amount;
  //   this.invoiceTax=this.invoiceTax+ invoice.tax;
  //   this.invoiceTotal=this.invoiceTotal+ invoice.amount+invoice.tax;
  // }
  // else{
  //   this.invoiceAmount=this.invoiceAmount- invoice.amount;
  //   this.invoiceTax=this.invoiceTax- invoice.tax;
  //   this.invoiceTotal=this.invoiceTotal- invoice.amount-invoice.tax;
  // }
  // this.invoiceAmount= 0;
  // this.invoiceTax= 0;
  // this.invoiceTotal= 0;
  //  let invoices=this.filterinvoicelist.filter(x=>x['isChecked']==true);
  //  invoices.forEach(invoice => {
  //   this.invoiceAmount=this.invoiceAmount+ invoice.mchRent;
  //   this.invoiceTax=this.invoiceTax+ invoice.mchRent*0.18;
  //   this.invoiceTotal=this.invoiceTotal+ invoice.mchRent+(invoice.mchRent*0.18);
  //  });


}

async clientSelect(){

  var result=this.filtersales.filter(x=>x['isChecked']==true);
  if(result.length>0){
    this.filtersales.forEach(element=>{
    element['isChecked']=false;
    });
  }
  else{
    this.filtersales.forEach(element=>{
      element['isChecked']=true;
      });
  }
}

async downloadXL(){
  let displayMonth = this.invoiceMonth.filter(
    (x) => x.id == this._invoiceMonth.value
  )[0].displaymonth;

  var arr=await this.reportService.downloadRentalInvoices(displayMonth);
   var ws=XLSX.utils.json_to_sheet(arr);
   var wb={Sheets:{'data':ws},SheetNames:['data']};
   var buffer=XLSX.write(wb,{bookType:'xlsx',type:'array'});
   var fileType='application/vnd.openxmlformat-officedocument.spreadsheetml.sheet';
   var fileExtention='.xlsx';
   var filename=Date.now().toString();
   var data:Blob=new Blob([buffer],{type:fileType});
   if (this.plt.is('cordova')) {
   this.file
         .writeFile(this.file.externalRootDirectory, `${filename}${fileExtention}`, data, {
           replace: true,
         })
         .then((fileEntry) => {
           this.toastController
           .create({
             message:
               'File Saved.',
             duration: 2000,
             color: 'Success',
           })
           .then((tost) => {
             tost.present();
           });
         });
       }
       else{
         FileSaver.saveAs(data, `${filename}${fileExtention}`);
         this.toastController
         .create({
           message:
             'File Saved.',
           duration: 2000,
           color: 'Success',
         })
         .then((tost) => {
           tost.present();
         });
       }
}

validateClosureDate(clientLocation:Location) {
  if (!clientLocation.closureDate) return false;
let mm=convertTimeStampToDate(clientLocation.closureDate).getMonth();
let yy=convertTimeStampToDate(clientLocation.closureDate).getFullYear();
let displayMonth=this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth;
let split=displayMonth.split('-');
let smm=this.months.indexOf(split[0]);
let syy=Number(split[1]);
let srcDate=new Date(yy,mm,1);
let destDate=new Date(syy,smm,1);
if(destDate>=srcDate){
  let macineCount=0;
  clientLocation.machines.forEach(machine => {
    if(this.validatePullOutDate(machine) && (machine?.mchRent>0 || machine?.mchInstCharges>0)){
      macineCount=macineCount+1;
    }
  });
  if(macineCount>0){
    return true;
  }
  return false;
}
return false;
}
validatePullOutDate(machine:Machine) {
if(!machine.pulloutDate)
  return true;
  let mm=new Date(machine.pulloutDate).getMonth();
  let yy=new Date(machine.pulloutDate).getFullYear();
  let displayMonth=this.invoiceMonth.filter((x) => x.id == this._invoiceMonth.value)[0].displaymonth;
  let split=displayMonth.split('-');
  let smm=this.months.indexOf(split[0]);
  let syy=Number(split[1]);
  let srcDate=new Date(yy,mm,1);
  let destDate=new Date(syy,smm,1);
  if(destDate<=srcDate){
    return true;
  }
  return false;
}





getBase64Image(){
  return 'data:image/png;base64,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';
}

getAuthSignature(sigReq:boolean=true){
  if(!sigReq)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=';
    else
  return 'data:image/png;base64,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'
}





}
