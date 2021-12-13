import { PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { MastBranch, MastStock } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { ConvertDateToMMMYYYY, GetNewId } from 'src/app/utilities/dataconverters';
import { PORequsitionService } from '../porequsition/porequsion.service';
import { PORequistionRequest } from '../porequsition/porequsition.model';
import { EntryType, StockRegister } from '../stockregister/stockregister.model';
import { StockRegisterService } from '../stockregister/stockregister.service';
@Component({
  selector: 'app-stockregister',
  templateUrl: './stockregister.page.html',
  styleUrls: ['./stockregister.page.scss'],
})
export class StockregisterPage implements OnInit {
  form: FormGroup;
  isLoading:boolean=true;
  stockDetail:MastStock[];
  stockCategory:string[];
  materialstockType=[] as any;
  stockType:string[];
  perPipe:PercentPipe;
  reqId: string=null;
  stockregDetail:StockRegister;
  branches:MastBranch[];
  poId=null;
  constructor(private route: ActivatedRoute,private navCtrl: NavController,private divisionService:DivisionService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private poreqService:PORequsitionService,
    private stockregService:StockRegisterService,
    private toastController: ToastController) { }
    async ngOnInit() {
      this.route.paramMap.subscribe(async (paramMap) => {
        if (paramMap.has('stockid')) {
         this.reqId= paramMap.get('stockid');
        }
        this.perPipe = new PercentPipe('en-US');

        if(this.reqId!=null && this.reqId!='0'){
          this.stockregDetail = await this.stockregService.getById(this.reqId);
        }

        await this.loadBranches();
        await this.loadStockDetails();
        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          if(this.stockregDetail==null)
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
        sourceName:new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        entryType:new FormControl(null, { updateOn: 'blur' }),
        branchFrom:new FormControl(null, { updateOn: 'blur' }),
        branch:new FormControl(null, { updateOn: 'blur' }),
        materialDetails:new FormArray([this.createMaterialDetail()]),
      });
      return true;
    }
    initializeUpdateForm() {
      this.form = new FormGroup({
        date: new FormControl(this.stockregDetail.date, { updateOn: 'blur',validators: [Validators.required] }),
        status:new FormControl(this.stockregDetail.entryType, { updateOn: 'blur',validators: [Validators.required] }),
        branch:new FormControl(this.stockregDetail.materialDetails==null?null:this.stockregDetail.materialDetails.length>0?this.stockregDetail.materialDetails[0].branch:null, { updateOn: 'blur' }),
        materialDetails:this.buildMaterialDetail(this.stockregDetail),
      });
      return true;
    }
    buildMaterialDetail(obj:PORequistionRequest){
      let fmarray=new FormArray([]);
      obj.materialDetails.forEach((material,index) => {
        fmarray.push(this.createMaterialDetail(material,index));
        let ref=this.stockDetail.filter(item=>item.category==material.category)[0].category;
        this.materialstockType[index].stockType=this.stockDetail.filter(item=>item.category==ref).map(item=>item.item).sort();
      });
      return fmarray;
    }
    createMaterialDetail(materialRate?:any,index?:any){
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
    onSourceNameChange(event){
      if (!event.target.value) return;
        this.form.get('sourceName').patchValue(event.target.value,{emitEvent: false});
    }
    onQuantityReceivedChange(event,element,index){
      if (!event.target.value) {
        if(this.stockregDetail!=null){
          element.controls['actQty'].patchValue(this.stockregDetail.materialDetails[index].actQty+this.stockregDetail.materialDetails[index].actQtyRecived,{emitEvent: false});
        }
        else{
          element.controls['actQty'].patchValue(this.stockregDetail.materialDetails[index].actQty,{emitEvent: false});
        }
      }

      else{

        if(this.stockregDetail!=null){

        let actQty= this.stockregDetail.materialDetails[index].actQty+this.stockregDetail.materialDetails[index].actQtyRecived;
        let penqty= actQty-Number(event.target.value);
        element.controls['actQty'].patchValue(penqty,{emitEvent: false});
        }
        else{
          let actQty=this.stockregDetail.materialDetails[index].actQty;
          let penqty= actQty-Number(event.target.value);
          element.controls['actQty'].patchValue(penqty,{emitEvent: false});
        }

      }






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
    async addupdateStockRegister(){
      if (!this.form.valid) {
        return;
      }
    let fm = <StockRegister>this.form.value;
      if (fm.materialDetails.length == 0) {
        return;
      }
      let isUpdate:boolean=false;
      if(this.reqId!=null && this.reqId!='0'){
        fm.id=this.reqId;
        isUpdate=true;
      }
      else{
        fm.sourceId=GetNewId();
        fm.materialDetails.forEach((material,index) => {
          material.id=GetNewId();
        });
      }


if(fm.sourceName=="Stock Transfer"){
let refid=GetNewId();
fm.entryType=EntryType.Credit;
fm.refId=refid;
let frombranch= await this.stockregService.addupdate(fm,false);
let br=fm.branch;
fm.branch=fm.branchFrom;
fm.branchFrom=br;
fm.entryType=EntryType.Debit;
fm.refId=refid;
let tobranch= await this.stockregService.addupdate(fm,false);
this.toastController
.create({
  message: 'Data updated',
  duration: 2000,
  color: 'success',
})
.then(async (tost) => {
  tost.present();
  '/stockmanagemt/stockregisterlist'
});
}
else{
  let entryType= this.form.get('entryType').value=="Add"?EntryType.Credit:EntryType.Debit;
  fm.entryType=entryType;
  this.stockregService.addupdate(fm, isUpdate).then((res) => {
    this.toastController
      .create({
        message: 'Data updated',
        duration: 2000,
        color: 'success',
      })
      .then(async (tost) => {
        tost.present();
        this.router.navigate([
          '/stockmanagemt/stockregisterlist'
        ]);
      });
  });
}
}

}



