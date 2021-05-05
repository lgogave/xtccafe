import { PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { MachineDetail, MastBranch, MastInstallKit, MastStock } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { DemoRequest } from '../../models/demo-request.model';
import { DemoRequestService } from '../../services/demo-request.service';
@Component({
  selector: 'app-edit-demo-request',
  templateUrl: './edit-demo-request.page.html',
  styleUrls: ['./edit-demo-request.page.scss'],
})
export class EditDemoRequestPage implements OnInit {
  form: FormGroup;
  demoRequest: DemoRequest;
  demoId: string;
  isLoading: boolean = false;
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

  constructor(
    private demoRequestService: DemoRequestService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router,
    private divisionService:DivisionService
  ) {}
  async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      if (!paramMap.has('demoId')) {
        this.navCtrl.navigateBack('/salespipeline/demorequests');
        return;
      }
      this.perPipe=new PercentPipe('en-US');
      this.demoId = paramMap.get('demoId');
      this.isLoading = true;


    });
  }
  async ionViewWillEnter() {
    this.isLoading = true;
    this.demoRequestService.getDemoRequestById(this.demoId).subscribe(async(res) => {
      this.demoRequest = res;
      await this.loadMachineDetails();
      await this.loadStockDetails();
      await this.loadInstallKitDetails();
      await this.loadBranches();
      var result = this.initializeForm();
      this.isLoading = false;
    });
  }
  initializeForm() {
    let machineArray=new FormArray([]);
    let materialArray=new FormArray([]);
    this.demoRequest.machineDetails.forEach(element => {
      machineArray.push(this.createMachineDetail(element))
    });
    this.demoRequest.materialDetails.forEach(element => {
      materialArray.push(this.createMaterialDetail(element))
    });
    let res=this.initDependantDropDown();



    this.form = new FormGroup({
      machineDetails: machineArray,
      materialDetails:materialArray,
      orgName: new FormControl(this.demoRequest.orgName, { updateOn: 'blur',validators: [Validators.required] }),
      orgStatus: new FormControl(this.demoRequest.orgStatus, {
        updateOn: 'blur',
      }),
      address: new FormControl(this.demoRequest.address, { updateOn: 'blur',validators: [Validators.required] }),
      addLocation: new FormControl(this.demoRequest.addLocation, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      addPincode: new FormControl(this.demoRequest.addPincode, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      addState: new FormControl(this.demoRequest.addState, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      conName: new FormControl(this.demoRequest.conName, { updateOn: 'blur' }),
      conMobile: new FormControl(this.demoRequest.conMobile, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      conEmail: new FormControl(this.demoRequest.conEmail, {
        updateOn: 'blur',
      }),
      accInstallation: new FormControl(this.demoRequest.accInstallation, {
        updateOn: 'blur',
      }),
      accOther: new FormControl(this.demoRequest.accOther, {
        updateOn: 'blur',
      }),
      instDemo: new FormControl(this.demoRequest.instDemo, {
        updateOn: 'blur',
      }),
      dateDelivery: new FormControl(this.demoRequest.dateDelivery, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      dateDemo: new FormControl(this.demoRequest.dateDemo, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      dateEndDemo: new FormControl(this.demoRequest.dateEndDemo, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      datePickup: new FormControl(this.demoRequest.datePickup, {
        updateOn: 'blur',validators: [Validators.required]
      }),
      satGSTNo: new FormControl(this.demoRequest.satGSTNo, {
        updateOn: 'blur',
      }),
      satSEZ: new FormControl(this.demoRequest.satSEZ, { updateOn: 'blur',validators: [Validators.required] }),
      satBranch:new FormControl(this.demoRequest.satBranch, { updateOn: 'blur',validators: [Validators.required] }),
      cnsNoEmp: new FormControl(this.demoRequest.cnsNoEmp, {
        updateOn: 'blur',
      }),
      cnsNoCups: new FormControl(this.demoRequest.cnsNoCups, {
        updateOn: 'blur',
      }),
    });
    return true;
  }
  editDemoRequest() {
    if (!this.form.valid) {
      return;
    }
    let demoRequest = <DemoRequest>this.form.value;
    if(demoRequest.machineDetails.length==0
      || demoRequest.materialDetails.length==0){
        return;
      }


    demoRequest.reqStatus = 'Demo Request Created';
    demoRequest.id = this.demoRequest.id;
    demoRequest.salespipelineId = this.demoRequest.salespipelineId;
    this.demoRequestService
      .editDemoRequest(demoRequest, this.demoId)
      .subscribe((res) => {
        this.toastController
          .create({
            message: 'Demo Request Updated. Id:' + this.demoRequest.id,
            duration: 2000,
            color: 'danger',
          })
          .then((tost) => {
            tost.present();
            this.router.navigate(['/salespipeline/demorequests']);
          });
      });
  }
  createMachineDetail(machine?:any){
    return new FormGroup({
      machineName: new FormControl(machine!=null?machine['machineName']: null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      machineType: new FormControl(machine!=null?machine['machineType']: null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      volumeType: new FormControl(machine!=null?machine['volumeType']: null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      machineCount: new FormControl(machine!=null?machine['machineCount']: null, {
        updateOn: "blur",
        //validators: [Validators.required],
      })
    })
  }
  createMaterialDetail(material?:any){


    return new FormGroup({
      category: new FormControl(material!=null?material['category']:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      item: new FormControl(material!=null?material['item']:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      uom: new FormControl(material!=null?material['uom']:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      hsnNo: new FormControl(material!=null?material['hsnNo']:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      gst: new FormControl(material!=null?material['gst']:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      qty: new FormControl(material!=null?material['qty']:null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),

    })
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
  initDependantDropDown(){
    this.machineCategory=[];
    this.machineCategory=this.machineDetail.sort((a,b)=>a.srno-b.srno).map(item=>item.name);
    this.stockType=[];
    this.stockType=this.stockDetail.map(item=>item.item).sort();
    return true;
  }

  onMaterialTypeChange(event,element){
    if (!event.target.value) return;
    let ref=this.stockDetail.filter(item=>item.item==event.target.value)[0];
    element.controls['uom'].patchValue(ref.uom,{emitEvent: false});
    element.controls['hsnNo'].patchValue(ref.hsnNo,{emitEvent: false});
    element.controls['gst'].patchValue(this.perPipe.transform(ref.gst),{emitEvent: false});
  }

}


