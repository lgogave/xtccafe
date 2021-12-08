import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { PORequsitionService } from '../porequsition/porequsion.service';
import { POMaterial, PORequistionRequest } from '../porequsition/porequsition.model';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import { SlowBuffer } from 'buffer';
import * as converter from 'number-to-words';
import { DatePipe } from '@angular/common';
pdfMake.vfs=pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-porequsitionlist',
  templateUrl: './porequsitionlist.page.html',
  styleUrls: ['./porequsitionlist.page.scss'],
})
export class PorequsitionlistPage implements OnInit {
  isLoading = false;
  reqId:string=null;
  polist: PORequistionRequest[];
  filterpolist: PORequistionRequest[];
  pdfObj=null;
  @ViewChild('searchElement') searchElement;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private poreqService:PORequsitionService,
    private router: Router,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
    ) { }

  ngOnInit() {
    this.doRefresh(null);
  }

  async doRefresh(event) {
    this.isLoading = true;
    this.polist = await this.poreqService.getAll();
    this.filterpolist = await this.applyFilter();
    this.isLoading = false;
    if (event != null) {
      event.target.complete();
    }
  }

  navigateToDetail(req){
    if(req!=undefined){
      this.router.navigate(['/','stockmanagemt','porequest',req.id]);
    }
  }

  async onFilter(ev: any){
    this.filterpolist= await this.applyFilter();
  }

  async applyFilter(){
    let serchTerm = this.searchElement.value;
    let filterresult: PORequistionRequest[] = [];
    this.polist.forEach((po) => {
       if(po.srNo?.toLowerCase().indexOf(serchTerm?.toLowerCase())> -1
      ) {
        filterresult.push(po);
      }
      else if(po.vendor?.toLowerCase().indexOf(serchTerm?.toLowerCase())> -1
      ) {
        filterresult.push(po);
      }
    });
    if(filterresult.length<=0 && serchTerm==""){
      return this.polist;
    }
    return filterresult;
  }

  downloadPO(req){
  let pobody:any=[];
  pobody.push([
    {
      text: 'LOREAL',
      fontSize: 16,
      bold: true,
      colSpan: 3,
      alignment: 'center',
      borderColor: ['#000000', '#000000', '#ffffff', '#000000'],
    },
   {},{},
   {
    text: 'Purchase Order',
    fontSize: 14,
    bold: true,
    colSpan: 3,
    alignment: 'center',
    borderColor: ['#ffffff', '#000000', '#ffffff', '#000000'],
  },{},{},
  {
    text: 'PO Number 4000614017\nDate:05.11.2021',
    fontSize: 12,
    bold: true,
    colSpan: 3,
    alignment: 'left',
  },{},{},
  ]);
  pobody.push([
  {
    text: 'Purchasing Group :ZI6IN-CORP-Centralize',
    fontSize: 12,
    bold: true,
    colSpan: 9,
    alignment: 'right',
    borderColor: ['#000000', '#', '#000000', '#ffffff'],
  },{},{},
  ]);
  pobody.push([
    {
      text: 'PO Requestor :GAURAV DUTTA',
      fontSize: 12,
      bold: true,
      colSpan: 9,
      alignment: 'right',
    },{},{},
    ]);
  pobody.push([
      {
        text: 'Details of Supplier (Shipped From)',
        fontSize: 10,
        bold: true,
        colSpan: 3,
        alignment: 'center',
      },{},{},
      {
        text: 'Delivery Address',
        fontSize: 10,
        bold: true,
        colSpan: 3,
        alignment: 'center',
      },{},{},
      {
        text: 'Billing Address(Plant Address)',
        fontSize: 10,
        bold: true,
        colSpan: 3,
        alignment: 'center',
      },{},{},
    ]);
  pobody.push([
      {
        text: 'Name:Dwija Foods Private Limited\n\nAddress :No 221, Atlanta Estate, Dr Ambedkar Chowk, Off Western Expre ss Goregaon East 400063 Mumbai Maharashtra State : Maharashtra Country : India GSTIN Number : 27AAHCD6098H1Z8 Place of Vendor : Maharashtra',
        fontSize: 10,
        colSpan: 3,
        alignment: 'left',
      },{},{},
      {
        text: 'Name : \n\n Address:',
        fontSize: 10,
        colSpan: 3,
        alignment: 'left',
      },{},{},
      {
        text: 'Name:Dwija Foods Private Limited\n\nAddress :No 221, Atlanta Estate, Dr Ambedkar Chowk, Off Western Expre ss Goregaon East 400063 Mumbai Maharashtra State : Maharashtra Country : India GSTIN Number : 27AAHCD6098H1Z8 Place of Vendor : Maharashtra',
        fontSize: 10,
        colSpan: 3,
        alignment: 'left',
      },{},{},
    ]);
  pobody.push(
      [
        {
          colSpan: 9,
          style: 'tableExample',
          // layout: 'headerLineOnly',
          table: {
            headerRows: 0,
            widths: [25, 120, '*', '*', '*', '*', '*', '*'],
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
                  text: 'Description of Goods.',
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

        },

      ],
    );






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
          widths: ['*', '*', '*', '*', '*', '*', '*','*', '*'],
          headerRows:1,
          // keepWithHeaderRows: 1,
          body:pobody
        },
      },
    ],
  };

  let amt = 0;
  let tax = 0;
  let totamt = 0;
  let cgsttax=0;
  let sgsttax=0;
  let subtable = docDefinition.content[0].table.body[5][0]['table'];
  let mergemat = this.mergeMaterials(req['materialDetails']);

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
        text: m['category'] + '-' + m['item'],
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
    text: amt.toFixed(2),
    alignment: 'right',
    fontSize: 8,
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

let taxType='IGST';
   //IGST Payable
   if(taxType.trim()=="IGST"){
    subtable.body.push([
      {
        text: '',
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
      {
        text: 'IGST Payable',
        fontSize: 8,
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
        fontSize: 8,
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
        fontSize: 8,
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
        text: cgsttax.toFixed(2),
        alignment: 'right',
        fontSize: 8,
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
        fontSize: 8,
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
        text: sgsttax.toFixed(2),
        alignment: 'right',
        fontSize: 8,
        bold: true,
        borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
      },
    ]);
  }


  let totrows =subtable.body.length > 10 ? 1 : 23-subtable.body.length;
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


  //Total Roundoff
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
      fontSize: 12,
      bold: true,
      alignment: 'right',
    },
  ]);

  let table: any = docDefinition.content[0].table;
  table.body.push([
    {
      text: 'Amount Chargeable (in words)',
      colSpan: 8,
      fontSize: 8,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
    },
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    {
      text: 'E. & O.E',
      fontSize: 8,
      borderColor: ['#ffffff', '#000000', '#000000', '#ffffff'],
    } as unknown,
  ]);

  table.body.push([
    {
      text: 'INR ' + converter.toWords(totroundoff).toUpperCase() + ' ONLY',
      colSpan: 9,
      bold: true,
      fontSize: 8,
      borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
    } as unknown,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  //Inset tax table later
  let taxtable: any =[];
  if(taxType.trim()=="IGST"){
  taxtable = [
    {
      colSpan: 9,
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
    ''
  ];
  table.body.push(taxtable);
  if (mergemat.hsn.length > 0) {
    let tothsn = new POMaterial();
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
      colSpan: 9,
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
    ''
  ];
  table.body.push(taxtable);
  if (mergemat.hsn.length > 0) {
    let tothsn = new POMaterial();
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
      fontSize: 8,
      colSpan: 2,
      borderColor: ['#000000', '#ffffff', '#ffffff', '#000000'],
    } as unknown,
    '',
    {
      text: 'INR ' + converter.toWords(tax).toUpperCase() + ' ONLY',
      colSpan: 7,
      fontSize: 8,
      bold: true,
      borderColor: ['#ffffff', '#ffffff', '#000000', '#000000'],
    },
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  table.body.push([
    {
      text:'\n\nPayment Conditions :45 Days',
      fontSize: 10,
      colSpan: 9,
      bold: true,
      borderColor: ['#000000', '#000000', '#000000', '#ffffff'],
    }]);
  table.body.push([
    {
      text: 'Note: If the tax charged on invoice are not paid to the Govt, Loreal has the right to deduct these taxes from the payment\nShopping Cart Name : TCC Coffee Consumables-November 2021\nNote:- (i)Original invoices with necessary supporting has to reach the Accounts Dept. within 10 days from the date of completion of Job.\n(ii) PO Number should be printed clearly on Original invoices, failing which it will not be accepted by LOreal India for Processing.\n(iii)The terms & Conditions of Loreals General Terms off Purchase & payment (GTP) shall be applicable to this PO.\n(iv) LOréal will restrict the payment/reimbursement up to the amount mentioned in the Purchase Order for the listed commitment.(v) The Service Provider / supplier of goods shall give the Client a valid tax invoice for any taxable supply in accordance with the GST law. The invoice raised by Service Provider / supplier of goods are correctly reflected in prescribed GST Return as per GST law and payment of GST is made to the government. This should be correspondingly reflected in GST portal of LOréal India Private Limited (client). If the invoice is not reflected in GST portal of the client, the entire amount of GST charged by service provider along with interest would be recovered from the Service provider / supplier of goods.',
      fontSize: 10,
      colSpan: 9,
      borderColor: ['#000000', '#000000', '#000000', '#000000'],
    },

  ]);
  table.body.push([
    {
      text:'The Document has been electronically approved and does not require manual signature',
      fontSize: 8,
      colSpan: 9,
      bold: true,
      alignment: 'center',
      borderColor: ['#ffffff', '#000000', '#ffffff', '#ffffff'],
    }]);

  /*
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
      text: 'gggggg',
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
      text: '0000000000',
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
      text: '------------',
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
      text: `${'-----------'} & ${'-----------'}`,
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
      fontSize: 7,
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
    { text:'', width: 100, height: 50, borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff']},
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
      fontSize: 8,
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
      fontSize: 7,
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

  */

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

  mergeMaterials(materials:POMaterial[]):any{
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

  viewGRN(req){
    if(req!=undefined){
      this.router.navigate(['/','stockmanagemt','grnlist','po',req.id]);
    }
  }

}
