import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
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
  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private salesService: SalespipelineService,
    private toastController: ToastController,
    private router: Router) {

  }
  async doRefresh(event) {
    this.isLoading = true;
    this.invoiceMonth=await this.salesService.getInvoiceMonth();
    this.invoice=await this.salesService.getInvoiceById(this.invId);
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

    let rentInv= await this.salesService.getRentalInvoice(this.invoice.clientId,this.invoice.clientLocationId,this.invoice.displaymonth);
    let invoiceModel = <InvoiceModel>this.form.value;

    let rentInvoice:RentalInvoice=null;
    if(rentInv.length>0){
      rentInvoice=rentInv[0];
      rentInvoice.mchRent=invoiceModel.rent;
    }

    forkJoin([ this.salesService
      .addupdateInvoice({id:this.invoice.id,
        ponumber:invoiceModel.ponumber,
        mchRent:invoiceModel.rent,
        billName:invoiceModel.billName,
        billAddress:invoiceModel.billAddress,
        installAt:invoiceModel.installAt,
        installAddress:invoiceModel.installAddress,
      },true),  this.salesService
      .addupdateRentalInvoice(rentInvoice,true)]).subscribe((res) => {
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
    // this.salesService
    // .addupdateInvoice({id:this.invoice.id,
    //   ponumber:invoiceModel.ponumber,
    //   mchRent:invoiceModel.rent,
    //   billName:invoiceModel.billName,
    //   billAddress:invoiceModel.billAddress,
    //   installAt:invoiceModel.installAt,
    //   installAddress:invoiceModel.installAddress,
    // },true)
    // .subscribe((res) => {

    // });

  }
  initializeUpdateForm(){
    this.form = new FormGroup({
      ponumber : new FormControl(this.invoice.ponumber, { updateOn: 'blur' }),
      month:new FormControl(this.invoice.displaymonth, { updateOn: 'blur',validators: [Validators.required] }),
      rent:new FormControl(this.invoice.mchRent, { updateOn: 'blur' }),
      billName:new FormControl(this.invoice.billName, { updateOn: 'blur' }),
      billAddress:new FormControl(this.invoice.billAddress, { updateOn: 'blur' }),
      installAt:new FormControl(this.invoice.installAt, { updateOn: 'blur' }),
      installAddress:new FormControl(this.invoice.installAddress, { updateOn: 'blur' })
    });
  }

}
