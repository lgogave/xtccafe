import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { DemoRequest } from '../../models/demo-request.model';
import { MachineDetail, MastBranch, MastInstallKit, MastStock } from 'src/app/models/division.model';
import { DemoRequestService } from 'src/app/services/demo-request.service';
import { ClientSales } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';
import { DivisionService } from 'src/app/services/division.service';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.page.html',
  styleUrls: ['./demo-request.page.scss'],
})
export class DemoRequestPage implements OnInit {
  form: FormGroup;
  saleId: string;
  locationIndex: string;
  isLoading:boolean=true;
  clientSales:ClientSales;
  machineDetail:MachineDetail[];
  machines:string[];
  machineType:string[];
  machineCategory:string[]
  stockDetail:MastStock[];
  installkit:MastInstallKit[];
  installkititems:string[];
  stockCategory:string[];
  stockType:string[];
  perPipe:PercentPipe;
  branches:MastBranch[];


  constructor(private route: ActivatedRoute,private navCtrl: NavController,private salespiplineService:SalespipelineService,
    private loadingCtrl: LoadingController,
    private demoRequestService:DemoRequestService,
    private toastController: ToastController,
    private router: Router,
    private divisionService:DivisionService) {}

  async ngOnInit() {



    this.route.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('salesId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      if (!paramMap.has('locationIndex')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.perPipe=new PercentPipe('en-US');
      this.saleId = paramMap.get('salesId');
      this.locationIndex = paramMap.get('locationIndex');
      await this.loadMachineDetails();
      await this.loadStockDetails();
      await this.loadInstallKitDetails();
      await this.loadBranches();
      this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
        loadingEl.present();
      this.salespiplineService.getSalesPipelineById(this.saleId ).subscribe(res=>{
        this.clientSales=res;
      var result=this.initializeForm();
      loadingEl.dismiss();
      this.isLoading=false;
      })
    });
    });
}

  initializeForm() {
    this.form = new FormGroup({
      machineDetails: new FormArray([this.createMachineDetail()]),
      materialDetails:new FormArray([this.createMaterialDetail()]),
      orgName: new FormControl(this.clientSales.clientsale.client, { updateOn: 'blur',validators: [Validators.required] }),
      orgStatus: new FormControl(this.clientSales.client.potentialNature, { updateOn: 'blur' }),
      address: new FormControl(this.clientSales.clientsale.locations[this.locationIndex].address, { updateOn: 'blur',validators: [Validators.required] }),
      addLocation: new FormControl(this.clientSales.clientsale.locations[this.locationIndex].city, { updateOn: 'blur',validators: [Validators.required] }),
      addPincode: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      addState: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      conName: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      conMobile: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      conEmail: new FormControl(null, { updateOn: 'blur' }),
      accInstallation: new FormControl(null, { updateOn: 'blur' }),
      accOther: new FormControl(null, { updateOn: 'blur' }),
      instDemo: new FormControl(null, { updateOn: 'blur' }),
      dateDelivery: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      dateDemo: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      dateEndDemo: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      datePickup: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      satGSTNo: new FormControl(null, { updateOn: 'blur' }),
      satSEZ: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      satBranch:new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
      cnsNoEmp: new FormControl(null, { updateOn: 'blur' }),
      cnsNoCups: new FormControl(null, { updateOn: 'blur' }),
    });
    return true;
  }
  createMachineDetail(){
    return new FormGroup({
      machineName: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      machineType: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      volumeType: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      machineCount: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      })
    })
  }
  createMaterialDetail(){
    return new FormGroup({
      category: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      item: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      uom: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      hsnNo: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      gst: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      qty: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),

    })
  }
  addDemoRequest(){
    if (!this.form.valid) {
      return;
    }
    let demoRequest = <DemoRequest>this.form.value;
    if(demoRequest.machineDetails.length==0
      || demoRequest.materialDetails.length==0){
        return;
      }

    demoRequest.reqStatus='Demo Request Created';
    let id=Math.floor(Math.random() * 26) + Date.now();
    demoRequest.id=id;
    demoRequest.salespipelineId=this.saleId;
    this.demoRequestService.addDemoRequest(demoRequest).subscribe((res) => {
       this.toastController.create({
        message: 'Demo Request Created. Id:'+id,
        duration: 2000,
        color:'danger',
      }).then((tost)=>{
        tost.present();
        this.router.navigate(['/salespipeline/demorequests']);
      });
    });
  }
  addMachine(){
    let mchdetails=this.form.get('machineDetails') as FormArray;
    mchdetails.push(this.createMachineDetail());
  }
  deleteMachine(index){
    let mchdetails=this.form.get('machineDetails') as FormArray;
    mchdetails.removeAt(index);
  }
  addMaterial(){
    let matdetails=this.form.get('materialDetails') as FormArray;
    matdetails.push(this.createMaterialDetail());
  }
  deleteMaterial(index){
    let matdetails=this.form.get('materialDetails') as FormArray;
    matdetails.removeAt(index);
  }
  async loadMachineDetails(){
    this.machineDetail=await this.divisionService.getMachineDetailList();
    this.machines=this.machineDetail.filter(item=>item.group==0).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
    this.machineType=this.machineDetail.filter(item=>item.group==1).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
    return true;
  }
  async loadStockDetails(){
    this.stockDetail=await this.divisionService.getStock();
    this.stockCategory=this.stockDetail.map(item=>item.category).filter((value, index, self) => self.indexOf(value) === index).sort();
    return true;
  }
  async loadInstallKitDetails(){
    this.installkit=await this.divisionService.getInstallKits();
    this.installkititems=this.installkit.map(item=>item.item).sort();
    return true;
  }
  async loadBranches(){
    this.branches=await this.divisionService.getBranches();
    return true;
  }


  onMachineChange(event,element){
    if (!event.target.value) return;
    let ref=this.machineDetail.filter(item=>item.name==event.target.value)[0].name;
    element.controls['volumeType'].reset();
    this.machineCategory=[];
    this.machineCategory=this.machineDetail.filter(item=>item.ref==ref && item.group==2).sort(
      (a,b)=>a.srno-b.srno).map(item=>item.name);
      if(ref=="FM" || ref=="Mtl(kg/mth)"){
        element.controls['volumeType'].patchValue("Not Applicable",{emitEvent: false})
      }
  }
  onMaterialChange(event,element){
    if (!event.target.value) return;
    let ref=this.stockDetail.filter(item=>item.category==event.target.value)[0].category;
    element.controls['item'].reset();
    this.stockType=[];
    element.controls['uom'].patchValue(null,{emitEvent: false});
    element.controls['hsnNo'].patchValue(null,{emitEvent: false});
    element.controls['gst'].patchValue(null,{emitEvent: false});
    this.stockType=this.stockDetail.filter(item=>item.category==ref).map(item=>item.item).sort();
  }
  onMaterialTypeChange(event,element){
    if (!event.target.value) return;
    let ref=this.stockDetail.filter(item=>item.item==event.target.value)[0];
    element.controls['uom'].patchValue(ref.uom,{emitEvent: false});
    element.controls['hsnNo'].patchValue(ref.hsnNo,{emitEvent: false});
    element.controls['gst'].patchValue(this.perPipe.transform(ref.gst),{emitEvent: false});
  }


}
