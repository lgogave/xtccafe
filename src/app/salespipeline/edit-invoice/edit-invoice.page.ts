import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { MastBranch } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { convertTimeStampToDate, convertTimestampToDate, convertToDateTime } from 'src/app/utilities/dataconverters';
import { Invoice, InvoiceModel, InvoiceMonth, RentalInvoice } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.page.html',
  styleUrls: ['./edit-invoice.page.scss'],
})
export class EditInvoicePage implements OnInit {
  isLoading:boolean=true;
  invId:string="";
  invoiceMonth:InvoiceMonth[]=[];
  invoice:Invoice;
  form: FormGroup;
  branches:MastBranch[];
  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private salesService: SalespipelineService,
    private divisionService:DivisionService,
    private toastController: ToastController,
    private router: Router,
    private datePipe:DatePipe) {

  }
  async doRefresh(event) {
    this.isLoading = true;
    this.invoiceMonth=await this.salesService.getInvoiceMonth();
    this.invoice=await this.salesService.getInvoiceById(this.invId);
    await this.loadBranches();
    var result = this.initializeUpdateForm();
    this.isLoading = false;
    if (event != null) {
      event.target.complete();
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('invId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.invId=paramMap.get('invId');
      this.doRefresh(null);
    });
  }

  async editInvoice(){
    if (!this.form.valid) {
      return;
    }
    if(this.invoice.srNo.startsWith("I/M")||this.invoice.srNo.startsWith("INV/Machine"))
    {
     await this.updateInstalltionInvoice(this.form);
    }
    else{
    let invoiceModel = <InvoiceModel>this.form.value;
      this.salesService
        .addupdateInvoice({id:this.invoice.id,
          ponumber:invoiceModel.ponumber,
          mchRent:invoiceModel.rent,
          billName:invoiceModel.billName,
          billAddress:invoiceModel.billAddress,
          installAt:invoiceModel.installAt,
          installAddress:invoiceModel.installAddress,
          status:invoiceModel.status,
          recAmount:invoiceModel.recAmount,
          tranCharges:invoiceModel.tranCharges,
          billbranch:invoiceModel.billbranch,
          taxType:invoiceModel.taxType,
          modifiedOn:new Date(),
          createdOn:new Date(invoiceModel.createdOn),
          displaymonth:this.datePipe.transform(new Date(invoiceModel.createdOn), 'MMM-yyyy')
        },true).subscribe((res) => {
          this.toastController
          .create({
            message: 'Data updated',
            duration: 2000,
            color: 'success',
          })
          .then((tost) => {
            tost.present();
            this.router.navigate(['/salespipeline/invoicelist/'+this.invoice.clientLocationId]);
          });
        });
      }
  }

  async loadBranches(){
    this.branches=await this.divisionService.getBranches();
    return true;
  }

  async updateInstalltionInvoice(fm:FormGroup){
    let invoiceModel = <InvoiceModel>fm.value;
    let invamt=0;
    let tranCharges=invoiceModel.tranCharges;
    this.invoice.dc.forEach(element=>{
      element['machineDetails'].forEach(mch=>{
        invamt=invamt+Number(mch.mchInstCharges);
      });
    });
     await this.salesService
        .addupdateInvoice({id:this.invoice.id,
          ponumber:invoiceModel.ponumber,
          mchRent:invoiceModel.rent,
          billName:invoiceModel.billName,
          billAddress:invoiceModel.billAddress,
          installAt:invoiceModel.installAt,
          installAddress:invoiceModel.installAddress,
          status:invoiceModel.status,
          recAmount:invoiceModel.recAmount,
          tranCharges:invoiceModel.tranCharges,
          billbranch:invoiceModel.billbranch,
          taxType:invoiceModel.taxType,
          amount:invamt,
          totamount:invamt+invamt*0.18,
          tax:invamt*0.18,
          modifiedOn:new Date(),
          createdOn:new Date(invoiceModel.createdOn),
          displaymonth:this.datePipe.transform(new Date(invoiceModel.createdOn), 'MMM-yyyy')
        },true).subscribe((res) => {
          this.toastController
          .create({
            message: 'Data updated',
            duration: 2000,
            color: 'success',
          })
          .then((tost) => {
            tost.present();
            this.router.navigate(['/salespipeline/invoicelist/'+this.invoice.clientLocationId]);
          });
        });

  }




  async getMachineDetails(salesId,locationId) {
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
        rental = Number(rental) + Number(element.mchRent);
        deposite = Number(deposite) + Number(element.mchSecDeposite);
        (instCharges = Number(instCharges) + Number(element.mchInstCharges)),
          (consumableCap =
            Number(consumableCap) + Number(element.consumableCap));
      });
      let machineData = {
        mchRent: rental,
        mchdeposite: deposite,
        mchinstCharges: instCharges,
        consumableCap: consumableCap,
        machineDetail: loc[0].machines,
      };
      return machineData;
    }
    return null;
  }

  initializeUpdateForm(){

    this.form = new FormGroup({
      ponumber : new FormControl(this.invoice.ponumber, { updateOn: 'blur' }),
      createdOn:new FormControl(convertTimeStampToDate(this.invoice.createdOn).toISOString(), { updateOn: 'blur' }),
      month:new FormControl(this.invoice.displaymonth, { updateOn: 'blur',validators: [Validators.required] }),
      rent:new FormControl(this.invoice.mchRent, { updateOn: 'blur' }),
      billName:new FormControl(this.invoice.billName, { updateOn: 'blur' }),
      billAddress:new FormControl(this.invoice.billAddress, { updateOn: 'blur' }),
      installAt:new FormControl(this.invoice.installAt, { updateOn: 'blur' }),
      installAddress:new FormControl(this.invoice.installAddress, { updateOn: 'blur' }),
      status:new FormControl(this.invoice.status, { updateOn: 'blur' }),
      recAmount:new FormControl(this.invoice.recAmount, { updateOn: 'blur' }),
      tranCharges:new FormControl(this.invoice.tranCharges==null?0:this.invoice.tranCharges, { updateOn: 'blur' }),
      billbranch:new FormControl(this.invoice.billbranch==null?0:this.invoice.billbranch, { updateOn: 'blur' }),
      taxType:new FormControl(this.invoice.taxType==null?0:this.invoice.taxType, { updateOn: 'blur' }),

    });
  }

}
