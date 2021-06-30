import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Invoice, InvoiceModel, InvoiceMonth } from '../salespipeline.model';
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

  editInvoice(){
    if (!this.form.valid) {
      return;
    }
    let invoiceModel = <InvoiceModel>this.form.value;
    this.salesService
    .addupdateInvoice({id:this.invoice.id, ponumber:invoiceModel.ponumber,mchRent:invoiceModel.rent},true)
    .subscribe((res) => {
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
  initializeUpdateForm(){
    this.form = new FormGroup({
      ponumber : new FormControl(this.invoice.ponumber, { updateOn: 'blur' }),
      month:new FormControl(this.invoice.displaymonth, { updateOn: 'blur',validators: [Validators.required] }),
      rent:new FormControl(this.invoice.mchRent, { updateOn: 'blur' })
    });
  }

}
