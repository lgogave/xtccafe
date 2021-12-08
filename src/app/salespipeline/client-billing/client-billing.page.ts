import { PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { MastBranch, MastStock } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { BillingDetail, BillingRate, ClientSales,InvoiceBank,Location } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';


@Component({
  selector: 'app-client-billing',
  templateUrl: './client-billing.page.html',
  styleUrls: ['./client-billing.page.scss'],
})
export class ClientBillingPage implements OnInit {
  form: FormGroup;
  clientSales:ClientSales;
  clientLocation:Location;
  isLoading:boolean=true;
  stockDetail:MastStock[];
  stockCategory:string[];
  materialstockType=[] as any;
  stockType:string[];
  perPipe:PercentPipe;
  saleId: string;
  locationId: string;
  billingDetail:BillingDetail;
  banks:InvoiceBank[];
  banknames:string[];
  branches:MastBranch[];
  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private divisionService:DivisionService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private salespiplineService:SalespipelineService,
    private toastController: ToastController) { }
  async ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('salesId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      if (!paramMap.has('locId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.saleId = paramMap.get('salesId');
      this.locationId = paramMap.get('locId');
      this.perPipe = new PercentPipe('en-US');
      this.billingDetail=await this.salespiplineService.getBillingDetail(this.saleId,this.locationId);
      await this.loadStockDetails();
      await this.loadBankDetails();
      await this.loadBranches();
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
        this.salespiplineService
          .getSalesPipelineById(this.saleId)
          .subscribe((res) => {
            this.clientSales = res;
            this.clientSales.clientsale.locations.forEach(location => {
              if(location.id==this.locationId){
                this.clientLocation=location;
              }
            });
            var result = this.initializeForm();
            loadingEl.dismiss();
            this.isLoading = false;
          });
      });
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      billName: new FormControl(this.billingDetail!=null?this.billingDetail.billName:this.clientSales.client.name, { updateOn: 'blur',validators: [Validators.required] }),
      billAddress: new FormControl(this.clientLocation.address, { updateOn: 'blur',validators: [Validators.required] }),
      location: new FormControl(this.clientLocation.city, { updateOn: 'blur',validators: [Validators.required] }),
      installAt: new FormControl(this.clientLocation.installAt, { updateOn: 'blur',validators: [Validators.required] }),
      installAddress: new FormControl(this.clientLocation.installAddress, { updateOn: 'blur',validators: [Validators.required] }),
      gstno: new FormControl(this.billingDetail!=null?this.billingDetail.gstno:this.clientSales.client.gstNumber, { updateOn: 'blur',validators: [Validators.required] }),
      taxType: new FormControl(this.billingDetail!=null?this.billingDetail.taxType:null, { updateOn: 'blur',validators: [Validators.required] }),
      materialDetails:this.billingDetail!=null?this.buildMaterialDetail(this.billingDetail):new FormArray([this.createMaterialDetail()]),
      pincode:  new FormControl(this.billingDetail!=null?this.billingDetail.pincode:null, { updateOn: 'blur',validators: [Validators.required] }),
      bank: new FormControl(this.billingDetail!=null?this.billingDetail.bank.name:null, { updateOn: 'blur',validators: [Validators.required] }),
      branch:  new FormControl(this.billingDetail!=null?this.billingDetail.branch:null, { updateOn: 'blur',validators: [Validators.required] }),

    });
    return true;
  }
  buildMaterialDetail(billDetail:BillingDetail){
    let fmarray=new FormArray([]);
    billDetail.materialDetails.forEach((material,index) => {
      fmarray.push(this.createMaterialDetail(material));
      let ref=this.stockDetail.filter(item=>item.category==material.category)[0].category;
      this.materialstockType[index].stockType=this.stockDetail.filter(item=>item.category==ref).map(item=>item.item).sort();
    });
    return fmarray;
  }
  createMaterialDetail(materialRate?:BillingRate){
    this.materialstockType.push({stockType:[]});
    return new FormGroup({
      category: new FormControl(materialRate!=null?materialRate.category:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      item: new FormControl(materialRate!=null?materialRate.item:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      uom: new FormControl(materialRate!=null?materialRate.uom:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      hsnNo: new FormControl(materialRate!=null?materialRate.hsnNo:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      gst: new FormControl(materialRate!=null?materialRate.gst:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      price: new FormControl(materialRate!=null?materialRate.price:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
    })
  }

  async loadStockDetails(){
    this.stockDetail=await this.divisionService.getStock();
    this.stockCategory=this.stockDetail.map(item=>item.category).filter((value, index, self) => self.indexOf(value) === index).sort();
    return true;
  }
  async loadBankDetails(){
    this.banks=await this.divisionService.getBanks();
    this.banknames=this.banks.map(item=>item.name).filter((value, index, self) => self.indexOf(value) === index).sort();
    return true;
  }
  async loadBranches(){
    this.branches=await this.divisionService.getBranches();
    return true;
  }

  addMaterial(){
    let matdetails=this.form.get('materialDetails') as FormArray;
    matdetails.push(this.createMaterialDetail());
  }
  deleteMaterial(index){
    let matdetails=this.form.get('materialDetails') as FormArray;
    matdetails.removeAt(index);
    this.materialstockType.splice(index,1);
  }

  onMaterialChange(event,element,index){
    if (!event.target.value) return;
    let ref=this.stockDetail.filter(item=>item.category==event.target.value)[0].category;
    element.controls['item'].reset();
    element.controls['uom'].patchValue(null,{emitEvent: false});
    element.controls['hsnNo'].patchValue(null,{emitEvent: false});
    element.controls['gst'].patchValue(null,{emitEvent: false});
    this.materialstockType[index].stockType=this.stockDetail.filter(item=>item.category==ref).map(item=>item.item).sort();
  }




  onMaterialTypeChange(event,element){
    if (!event.target.value) return;
    let ref=this.stockDetail.filter(item=>item.item==event.target.value)[0];
    element.controls['uom'].patchValue(ref.uom,{emitEvent: false});
    element.controls['hsnNo'].patchValue(ref.hsnNo,{emitEvent: false});
    element.controls['gst'].patchValue(this.perPipe.transform(ref.gst),{emitEvent: false});
  }

  addBillingDetail(){
    if (!this.form.valid) {
      return;
    }
    let fmbillingDetail = <BillingDetail>this.form.value;
    fmbillingDetail.salesId=this.saleId;
    fmbillingDetail.clientId = this.clientSales.clientsale.clientId;
    fmbillingDetail.locationId = this.locationId;
    fmbillingDetail.bank=this.banks.filter(x=>x.name==fmbillingDetail.bank)[0];
    // let nbranchs=this.branches.filter(x=>x.name==fmbillingDetail.branch);
    // let branch='';
    // if(nbranchs.length>0){
    //   branch=nbranchs[0].name;
    // }

    if(this.billingDetail!=null){
      fmbillingDetail.id=this.billingDetail.id;
    }
    if (fmbillingDetail.materialDetails.length == 0) {
      return;
    }

    //delete Empty elements
    let delData =fmbillingDetail.materialDetails.filter(item => item.item === null);
    delData.forEach(element=>{
      const index: number = fmbillingDetail.materialDetails.indexOf(element);
      if (index !== -1) {
        fmbillingDetail.materialDetails.splice(index, 1);
      }
    });

    this.salespiplineService
      .addupdateBillingDetail(fmbillingDetail,this.billingDetail!=null?true:false)
      .subscribe((res) => {
        this.toastController
          .create({
            message: 'Data updated',
            duration: 2000,
            color: 'success',
          })
          .then((tost) => {
            tost.present();
            this.router.navigate(['/salespipeline']);
          });
      });
  }
}
