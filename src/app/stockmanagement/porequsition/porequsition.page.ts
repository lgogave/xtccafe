import { PercentPipe } from '@angular/common';
import { noUndefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { MastBranch, MastStock } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { GetNewId } from 'src/app/utilities/dataconverters';
import { PORequsitionService } from './porequsion.service';
import { PORequistionRequest } from './porequsition.model';


@Component({
  selector: 'app-porequsition',
  templateUrl: './porequsition.page.html',
  styleUrls: ['./porequsition.page.scss'],
})
export class PorequsitionPage implements OnInit {
  form: FormGroup;
  isLoading:boolean=true;
  stockDetail:MastStock[];
  stockCategory:string[];
  materialstockType=[] as any;
  stockType:string[];
  perPipe:PercentPipe;
  reqId: string=null;
  poreqDetail:PORequistionRequest;
  branches:MastBranch[];
  constructor(private route: ActivatedRoute,private navCtrl: NavController,private divisionService:DivisionService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private poreqService:PORequsitionService,
    private toastController: ToastController) { }
    async ngOnInit() {
      this.route.paramMap.subscribe(async (paramMap) => {
       
        if (paramMap.has('id')) {
         this.reqId= paramMap.get('id');
        }
        this.perPipe = new PercentPipe('en-US');
        if(this.reqId!=null){
          this.poreqDetail = await this.poreqService.getById(this.reqId);
        }
        await this.loadBranches();
        await this.loadStockDetails();
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          if(this.poreqDetail==null)
          var result = this.initializeForm();
          else
          var result = this.initializeUpdateForm();
          loadingEl.dismiss();
          this.isLoading = false;
        });
      });
    }
    initializeForm() {
      this.form = new FormGroup({
        date: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        status:new FormControl('Open', { updateOn: 'blur',validators: [Validators.required] }),
        poType:new FormControl('Single', { updateOn: 'blur',validators: [Validators.required] }),
        vendor:new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        branch:new FormControl(null, { updateOn: 'blur' }),
        materialDetails:new FormArray([this.createMaterialDetail()]),
      });
      return true;
    }
    initializeUpdateForm() {
      this.form = new FormGroup({
        date: new FormControl(this.poreqDetail.date, { updateOn: 'blur',validators: [Validators.required] }),
        status:new FormControl(this.poreqDetail.status, { updateOn: 'blur',validators: [Validators.required] }),
        poType:new FormControl(this.poreqDetail.poType, { updateOn: 'blur',validators: [Validators.required] }),
        vendor:new FormControl(this.poreqDetail.vendor, { updateOn: 'blur',validators: [Validators.required] }),
        branch:new FormControl(this.poreqDetail.materialDetails==null?null:this.poreqDetail.materialDetails.length>0?this.poreqDetail.materialDetails[0].branch:null, { updateOn: 'blur' }),
        materialDetails:this.buildMaterialDetail(this.poreqDetail),
      });
      
      return true;
    }
    buildMaterialDetail(obj:PORequistionRequest){
      let fmarray=new FormArray([]);
      obj.materialDetails.forEach((material,index) => {
        fmarray.push(this.createMaterialDetail(material));
        let ref=this.stockDetail.filter(item=>item.category==material.category)[0].category;
        this.materialstockType[index].stockType=this.stockDetail.filter(item=>item.category==ref).map(item=>item.item).sort();
      });
      return fmarray;
    }
    createMaterialDetail(materialRate?:any){
      this.materialstockType.push({stockType:[]});
      return new FormGroup({
        branch: new FormControl(materialRate!=null?materialRate.branch:null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
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
        rate: new FormControl(materialRate!=null?materialRate.rate:null, {
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
    async loadBranches(){
      this.branches=await this.divisionService.getBranches();
      return true;
    }
    getBranches(){
     return  Object.assign([], this.branches);
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
      element.controls['gst'].patchValue(ref.gst,{emitEvent: false});
    }
    onPOTypeChange(event){
      if (!event.target.value) return;
        this.form.get('poType').patchValue(event.target.value,{emitEvent: false});
    }
    onBranchChange(event){
      if (!event.target.value) return;
        this.form.get('branch').patchValue(event.target.value,{emitEvent: false});
    }
    async  padLeadingZeros(num, size) {
      var s = num + '';
      while (s.length < size) s = '0' + s;
      return await s;
    }
    async addupdatePO(){
      if (!this.form.valid) {
        return;
      }

      

    let fmPOReq = <PORequistionRequest>this.form.value;
      if (fmPOReq.materialDetails.length == 0) {
        return;
      }
      let isValid=true;
      fmPOReq.materialDetails.forEach(element => {
        if(fmPOReq.poType!="Single" && element.branch==null){
          isValid=false;
        }
      });
      if (!isValid) {
        return;
      }


      if(fmPOReq.poType=="Single"){
        fmPOReq.materialDetails.forEach(element => {
          element.branch=this.form.get("branch").value;
        }); 
      }
      let isUpdate:boolean=false;
      if(this.reqId!=null){
        fmPOReq.id=this.reqId;
        isUpdate=true;
      }
      else{
        fmPOReq.srNo = "123";
    
        fmPOReq.materialDetails.forEach(material => {
          material.id=GetNewId();
          material.actQty=material.qty;
        });
      }

      fmPOReq.materialDetails.forEach(material => {
        material.amount=Number(material.rate) * Number(material.qty);
        material.tax= material.amount*(Number(material.gst));
        material.totamount=material.amount+material.tax;
      });
        this.poreqService
          .addupdate(fmPOReq, isUpdate)
          .subscribe((res) => {
            this.toastController
              .create({
                message: 'Data updated',
                duration: 2000,
                color: 'success',
              })
              .then((tost) => {
                tost.present();
                this.router.navigate([
                  '/stockmanagemt/polist'
                ]);
              });
          });


    }
  }

