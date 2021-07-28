import { PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { MastBranch, MastStock } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { BillingDetail, BillingRate, ClientSales,DCAddHocMaterial,DCDetail,DCDetailModel,Invoice,Location, ReceiptBook } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';


@Component({
  selector: 'app-delivery-challan',
  templateUrl: './delivery-challan.page.html',
  styleUrls: ['./delivery-challan.page.scss'],
})
export class DeliveryChallanPage implements OnInit {
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
  dcId: string=null;
  locationId: string;
  billingDetail:BillingDetail;
  dcDetail:DCDetail;
  branches:MastBranch[];
  constructor(private route: ActivatedRoute,private navCtrl: NavController,private divisionService:DivisionService,
    private loadingCtrl: LoadingController, private router: Router,private salespiplineService:SalespipelineService,
    private toastController: ToastController) { }

    async ngOnInit() {
      this.route.paramMap.subscribe(async (paramMap) => {
        if (!paramMap.has('salesId')) {
          this.navCtrl.navigateBack('/salespipeline');
        }
        if (!paramMap.has('locId')) {
          this.navCtrl.navigateBack('/salespipeline');
        }
        if (paramMap.has('dcId')) {
         this.dcId= paramMap.get('dcId');
        }
        this.saleId = paramMap.get('salesId');
        this.locationId = paramMap.get('locId');
        this.perPipe = new PercentPipe('en-US');
        if(this.dcId!=null){
          this.dcDetail = await this.salespiplineService.getDCDetail(this.dcId);

        }

        this.billingDetail=await this.salespiplineService.getBillingDetail(this.saleId,this.locationId);
        await this.loadStockDetails();
        await this.loadBranches();
        console.log(this.stockDetail);

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
              if(this.dcDetail==null)
              var result = this.initializeForm();
              else
              var result = this.initializeUpdateForm();

              console.log(this.form);
              loadingEl.dismiss();
              this.isLoading = false;
            });
        });
      });
    }
    initializeForm() {
      this.form = new FormGroup({
        billName: new FormControl(this.billingDetail!=null?this.billingDetail.billName:this.clientSales.client.name, { updateOn: 'blur',validators: [Validators.required] }),
        billAddress: new FormControl(this.clientLocation.address, { updateOn: 'blur' }),
        location: new FormControl(this.clientLocation.installAt, { updateOn: 'blur',validators: [Validators.required] }),
        address: new FormControl(this.clientLocation.installAddress, { updateOn: 'blur',validators: [Validators.required] }),
        pincode: new FormControl(this.billingDetail!=null?this.billingDetail.pincode:null, { updateOn: 'blur',validators: [Validators.required] }),
        branch: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        date: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        materialDetails:new FormArray([this.createMaterialDetail()]),
        materialAddhoc:new FormArray([this.createaddhocDetail()]),
      });
      return true;
    }


    initializeUpdateForm() {
      this.form = new FormGroup({
        billName: new FormControl(this.dcDetail.billName, { updateOn: 'blur',validators: [Validators.required] }),
        billAddress: new FormControl(this.dcDetail.billAddress, { updateOn: 'blur',validators: [Validators.required] }),
        location: new FormControl(this.dcDetail.location, { updateOn: 'blur',validators: [Validators.required] }),
        address: new FormControl(this.dcDetail.address, { updateOn: 'blur',validators: [Validators.required] }),
        pincode: new FormControl(this.dcDetail.pincode, { updateOn: 'blur',validators: [Validators.required] }),
        branch: new FormControl(this.dcDetail.branch, { updateOn: 'blur',validators: [Validators.required] }),
        date: new FormControl(this.dcDetail.date, { updateOn: 'blur',validators: [Validators.required] }),
        materialDetails:this.buildMaterialDetail(this.dcDetail),
        materialAddhoc:this.buildAddHocMaterialDetail(this.dcDetail),
      });
      return true;
    }


    buildMaterialDetail(dcdetail:DCDetail){
      console.log(dcdetail.materialDetails);
      let fmarray=new FormArray([]);
      dcdetail.materialDetails.forEach((material,index) => {
        fmarray.push(this.createMaterialDetail(material));
        let ref=this.stockDetail.filter(item=>item.category==material.category)[0].category;
        this.materialstockType[index].stockType=this.stockDetail.filter(item=>item.category==ref).map(item=>item.item).sort();
      });
      return fmarray;
    }
    buildAddHocMaterialDetail(dcdetail:DCDetail){
      let fmarray=new FormArray([]);
      dcdetail.materialAddhoc.forEach((material,index) => {
        fmarray.push(this.createaddhocDetail(material));
      });
      return fmarray;
    }


    createMaterialDetail(materialRate?:any){
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
        qty: new FormControl(materialRate!=null?materialRate.qty:null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
      })
    }
    createaddhocDetail(dcAddHocMaterial?:DCAddHocMaterial){
      return new FormGroup({
        item: new FormControl(dcAddHocMaterial!=null?dcAddHocMaterial.item: null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        price: new FormControl(dcAddHocMaterial!=null?dcAddHocMaterial.price:null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
      })
    }
    async loadStockDetails(){
      if(this.billingDetail!=null){
        this.stockDetail=this.billingDetail.materialDetails as MastStock[];
        this.stockCategory=this.stockDetail.map(item=>item.category).filter((value, index, self) => self.indexOf(value) === index).sort();
      }
      else{
      this.stockDetail=[];
      this.stockCategory=[];
      }
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
    addMaterialAddhoc(){
      let matdetails=this.form.get('materialAddhoc') as FormArray;
      matdetails.push(this.createaddhocDetail());
    }
    deleteMaterialAddhoc(index){
      let matdetails=this.form.get('materialAddhoc') as FormArray;
      matdetails.removeAt(index);
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
      element.controls['gst'].patchValue(ref.gst,{emitEvent: false});
    }
    async  padLeadingZeros(num, size) {
      var s = num + '';
      while (s.length < size) s = '0' + s;
      return await s;
    }
    updateReceiptBook(receipt:ReceiptBook){
      this.salespiplineService.addupdateReceiptBook(receipt,receipt.id==null?false:true).subscribe()
    }
    async addDC(){
      if (!this.form.valid) {
        return;
      }
    if(this.dcId!=null)
    this.dcDetail = await this.salespiplineService.getDCDetail(this.dcId);

    let fmbillingDetail = <DCDetail>this.form.value;
    let branch=this.branches.filter(x=>x.name==fmbillingDetail.branch)[0];
      fmbillingDetail.salesId=this.saleId;
      fmbillingDetail.clientId = this.clientSales.clientsale.clientId;
      fmbillingDetail.locationId = this.locationId;
      fmbillingDetail.isDelete =false;
      if(this.billingDetail!=null){
        fmbillingDetail.id=this.billingDetail.id;
      }
      if (fmbillingDetail.materialDetails.length == 0) {
        return;
      }
      fmbillingDetail.materialDetails.forEach(material => {
        let filterresult=this.billingDetail.materialDetails.filter(m=>m.item==material.item && m.category==material.category && m.hsnNo==material.hsnNo);
        material.rate=Number(filterresult[0].price);
        material.amount=Number(filterresult[0].price) * Number(material.qty);
        material.tax= material.amount*(Number(filterresult[0].gst.replace('%',''))/100);
        material.totamount=material.amount+material.tax;
      });
      if(this.dcDetail==null){
        let receiptBook = new ReceiptBook();
        receiptBook.category = 'DC';
        receiptBook.type = 'CON';
        receiptBook.branch = branch.initials;
        receiptBook.year = 2021;
        let receiptNo = await this.salespiplineService.getlastReceiptNumber(receiptBook);
        if (receiptNo != null) {
          receiptBook.id = receiptNo.id;
          receiptBook.srnumber = receiptNo.srnumber + 1;
        } else {
          receiptBook.srnumber = 1;
          receiptBook.id = null;
        }
        let srNo = await this.padLeadingZeros(receiptBook.srnumber, 6);
        fmbillingDetail.srNo = `${receiptBook.category}/${receiptBook.type}/${branch.initials}/${receiptBook.year}/${srNo}`;
        fmbillingDetail.isUsed = false;
        this.salespiplineService
          .addupdateDC(fmbillingDetail, false)
          .subscribe((res) => {
            this.toastController
              .create({
                message: 'Data updated',
                duration: 2000,
                color: 'success',
              })
              .then((tost) => {
                this.updateReceiptBook(receiptBook);
                tost.present();
                this.router.navigate([
                  '/salespipeline/deliverychallanlist/' +
                    fmbillingDetail.clientId,
                ]);
              });
          });
      }
      else
      {
        fmbillingDetail.srNo = this.dcDetail.srNo;
        fmbillingDetail.isUsed=this.dcDetail.isUsed;
        fmbillingDetail.id=this.dcId;
        let invoice:any=await this.salespiplineService.getInvoiceByDCId(this.dcDetail.id);
        this.updateInvoice(invoice,fmbillingDetail);

        this.salespiplineService
        .addupdateDC(fmbillingDetail,true)
        .subscribe((res) => {
          this.toastController
            .create({
              message: 'Data updated',
              duration: 2000,
              color: 'success',
            })
            .then((tost) => {
              tost.present();
              this.router.navigate(['/salespipeline/deliverychallanlist/'+fmbillingDetail.clientId]);
            });
        });
      }
    }

    async updateInvoice(invoice:Invoice,dc:DCDetail){
      if(invoice==null)
      return;
      let inx:any=0;
      invoice.dc.forEach((element,index)=> {
        if(element.id===dc.id)
        {
          inx=index;
        }
      });
      invoice.dc[inx]=<DCDetailModel>dc;

     let totamount:number=0; let tax:number=0;let amount:number=0;
      invoice.dc.forEach(dcelement => {
        dcelement.materialDetails.forEach((material) => {
          amount = amount + material.amount;
          tax = tax + material.tax;
          totamount = totamount + amount + tax;
        });
      });
      invoice.amount=amount;
      invoice.tax=tax;
      invoice.totamount=totamount;
      this.salespiplineService.addupdateInvoice(invoice,true).subscribe();
    }
  }
