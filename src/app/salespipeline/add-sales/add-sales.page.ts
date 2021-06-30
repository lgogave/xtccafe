import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/clients/client.model';
import { ClientService } from 'src/app/clients/client.service';
import { ClientStatus, MachineDetail } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { GetNewId } from 'src/app/utilities/dataconverters';
import { ClientSalesPipeline, Location, Machine, SalesPipeline } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.page.html',
  styleUrls: ['./add-sales.page.scss'],
})
export class AddSalesPage implements OnInit {
  form: FormGroup;
  formArray: FormArray;
  isLoading = false;
  entryForm: FormGroup;
  clients:Client[];
  loadedClients:Client[];
  clientGroup:string[];
  clientsStatus:ClientStatus[];
  machineDetail:MachineDetail[];
  machines:string[]
  machineType:string[]
  machineCategory:string[]



  private clientSub:Subscription;

  get locations(){
    return this.form.get('dataEntry') as FormArray;
  }
  addLocations(){
    this.locations.push(this.buildDataEntryForm());
  }
  deleteLocatios(index){
    this.locations.removeAt(index);
  }

  getMachineDetails(fg:FormGroup){
   let test=fg.get('machineDetails') as FormArray;
    return fg.get('machineDetails') as FormArray;
  }
  addMachineDetails(fg:FormGroup){
    this.getMachineDetails(fg).push(this.buildMachineDetailForm());
  }
  deleteMachineDetails(fg:FormGroup,index){
    this.getMachineDetails(fg).removeAt(index);
  }


 buildDataEntryForm(){
  return new FormGroup({
    machineDetails: new FormArray([this.buildMachineDetailForm()]),
    city: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    address: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    installAt: new FormControl(null, {
      updateOn: "blur",
    }),
    installAddress: new FormControl(null, {
      updateOn: "blur",
    }),
    currentStatus: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    closureDate: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    amount: new FormControl(null, {
      updateOn: 'blur',
    }),
    billingAmount: new FormControl(null, {
      updateOn: 'blur',
    }),
    machineCount: new FormControl(null, {
      updateOn: 'blur',
    }),
  });
}
buildMachineDetailForm(){
  return new FormGroup({
    machineName: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    machineType: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    volumeType: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    machineCount: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    machineSrNo: new FormControl(null, {
      updateOn: "blur",
    }),
    rate: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    amount: new FormControl(null, {
      updateOn: 'blur',
    }),
    conflevel: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required,Validators.min(0),Validators.max(100)],
    }),
    billingAmount: new FormControl(null, {
      updateOn: 'blur',
    }),
    mchRent: new FormControl(null, {
      updateOn: 'blur',
    }),
    consumableCap: new FormControl(null, {
      updateOn: 'blur',
    }),
    mchInstCharges: new FormControl(null, {
      updateOn: 'blur',
    }),
    isInstChargesConsider: new FormControl(null, {
      updateOn: 'blur',
    }),
    mchSecDeposite: new FormControl(null, {
      updateOn: 'blur',
    }),
  });
}
  constructor(private route:Router,private loadingCtrl:LoadingController,private clientService:ClientService,
  private salesPipelineService:SalespipelineService,private divisionService:DivisionService,private toastController: ToastController) { }
  async ngOnInit() {
    this.form = new FormGroup({
      dataEntry: new FormArray([this.buildDataEntryForm()]),
      group: new FormControl(null, {
        updateOn: "blur",
      }),
      client: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      comments: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      amount: new FormControl(null, {
        updateOn: 'blur',
      }),
      billingAmount: new FormControl(null, {
        updateOn: 'blur',
      }),
      machineCount: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
    this.form.valueChanges.subscribe(val=>{
      if(val.client == null)
      return;
      let clientamount:number=0;
      let clientbillamt:number=0;
      let clientmachinecount=0;
      this.form.get('dataEntry')['controls'].forEach((location,i) => {
        let locamount:number=0;
        let locmachinecount=0;
        let locbillamt:number=0;
        this.form.get('dataEntry')['controls'][i].get('machineDetails')['controls'].forEach((machine,j) => {
          let rate:number=this.form.get('dataEntry')['controls'][i].get('machineDetails')['controls'][j].get('rate').value;
          let mccount:number=this.form.get('dataEntry')['controls'][i].get('machineDetails')['controls'][j].get('machineCount').value;
          let conflevel:number=this.form.get('dataEntry')['controls'][i].get('machineDetails')['controls'][j].get('conflevel').value;
          let amt=rate*Math.round(mccount*conflevel/100);

          let closureDate=new Date(this.form.get('dataEntry')['controls'][i].get('closureDate').value);
          let closureamt=this.financialYearCalculation(closureDate,amt);

          locamount=locamount+amt;
          clientamount=clientamount+amt;
          locbillamt=locbillamt+closureamt;
          clientbillamt=clientbillamt+closureamt;
          locmachinecount=locmachinecount+mccount;
          clientmachinecount=clientmachinecount+mccount;

          this.form.get('dataEntry')['controls'][i].get('machineDetails')['controls'][j].get('amount').patchValue(amt,{emitEvent: false});
          this.form.get('dataEntry')['controls'][i].get('machineDetails')['controls'][j].get('billingAmount').patchValue(closureamt,{emitEvent: false});

        });

        this.form.get('dataEntry')['controls'][i].get('amount').patchValue(locamount,{emitEvent: false});
        this.form.get('dataEntry')['controls'][i].get('billingAmount').patchValue(locbillamt,{emitEvent: false});
        this.form.get('dataEntry')['controls'][i].get('machineCount').patchValue(locmachinecount,{emitEvent: false});


      });
      this.form.get('amount').patchValue(clientamount,{emitEvent: false});
      this.form.get('billingAmount').patchValue(clientbillamt,{emitEvent: false});
      this.form.get('machineCount').patchValue(clientmachinecount,{emitEvent: false});
    })
    this.clients=await this.clientService.getClientList();
    console.log(this.clients);
    this.clientGroup = this.clients
      .map((item) => item.group)
      .filter((value, index, self) => {
        if (value != null) return self.indexOf(value) === index;
      }).sort();
      this.loadedClients=this.clients;
      this.clientsStatus=await this.divisionService.getClientStatusList();
      this.machineDetail=await this.divisionService.getMachineDetailList();
      this.machines=this.machineDetail.filter(item=>item.group==0).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
      this.machineType=this.machineDetail.filter(item=>item.group==1).sort((a,b)=>a.srno-b.srno).map(item=>item.name);

    }
  ionViewWillEnter(){
    // this.clientService.fetchClients().subscribe(() => {
    // });
  }
  async onAddSalespipeline(){
    if (!this.form.valid) {
      return;
    }
    var exiclientId=await this.salesPipelineService.getClientById(this.form.value.client);
    if(exiclientId.length>0){
     await this.toastController.create({
       message: 'Client data is already exist.',
       duration: 2000,
       color:'danger',
     }).then((tost)=>{
       tost.present();
     });
     return;
    }


    let salesPipeline:SalesPipeline[]=this.AddSalesPipeline();
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      // Tree Structue Input
      this.AddClientSalesPipeLine();
      let arrayLength=salesPipeline.length-1;
      salesPipeline.forEach((item,index)=>{
        this.salesPipelineService.addSalesPipeline(item).subscribe((response)=>{

         if (arrayLength == index) {
           this.removeLoading(loadingEl);
          }
        })
      })
    });
  }
 removeLoading(loadingEl:HTMLIonLoadingElement){
  this.isLoading = false;
  loadingEl.dismiss();
  this.form.reset();
  this.route.navigate(["/salespipeline"]);
 }
private AddClientSalesPipeLine(){
  let locations=[];
    for(let i=0;i<this.form.value.dataEntry.length;i++){
      let location=this.form.value.dataEntry[i];
      let machines=[];
      for(let j=0;j<location.machineDetails.length;j++){
        let machine=location.machineDetails[j];
        machines.push(
          new Machine(
            machine.machineName,
            machine.machineType,
            machine.volumeType,
            machine.machineCount,
            machine.machineSrNo,
            machine.rate,
            machine.amount,
            machine.conflevel,
            machine.billingAmount,
            machine.mchRent,
            machine.consumableCap,
            machine.mchInstCharges,
            machine.mchSecDeposite,
            false
          )
        );
      }
      locations.push(new Location(location.city,
        location.address,
        location.installAt,
        location.installAddress,
        location.currentStatus,
        new Date(location.closureDate),
        location.amount,
        machines.map((obj)=> {return Object.assign({}, obj)}),
        location.billingAmount,
        location.machineCount,
        GetNewId()
        ))
    }
    let clientSalesPipeline: ClientSalesPipeline = new ClientSalesPipeline(
      '',
      this.form.value.group,
      this.form.value.client,
      this.clients.filter(
        (item) => item.id == this.form.value.client
      )[0].name,
      this.form.value.comments,
      '',
      new Date(),
      this.form.value.amount,
      locations.map((obj)=> {return Object.assign({}, obj)}),
      'add',
      this.form.value.billingAmount,
      this.form.value.machineCount,


    );
    this.salesPipelineService.addClientSalesPipeline(clientSalesPipeline).subscribe((response)=>{
})
}
private AddSalesPipeline():SalesPipeline[]{
  let salesPipeline:SalesPipeline[]=[];
    for(let i=0;i<this.form.value.dataEntry.length;i++){
      let location=this.form.value.dataEntry[i];
      for(let j=0;j<location.machineDetails.length;j++){
        let machine=location.machineDetails[j];
        salesPipeline.push(new SalesPipeline("",
        this.form.value.group,
        this.form.value.client,
        this.clients.filter(
          (item) => item.id == this.form.value.client
        )[0].name,
        this.form.value.comments,
        location.city,
        location.address,
        location.installAt,
        location.installAddress,
        location.currentStatus,
        new Date(location.closureDate),
        machine.machineName,
        machine.machineType,
        machine.volumeType,
        machine.machineCount,
        machine.machineSrNo,
        machine.rate,
        machine.amount,
        location.amount,
        this.form.value.amount,
        "",
        new Date(),
        machine.conflevel
        ))
      }
    }
    return salesPipeline;
}
ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
}

onChangeGroup(event){
  let grp=event.target.value;
  this.form.controls['client'].reset();
  this.loadedClients=[];
  this.loadedClients=this.clients.filter(item=>item.group===grp);
}

financialYearCalculation(closureDate:Date,amount:number){
  let extraday=7;
  let startDate:Date=new Date(closureDate.getFullYear(),closureDate.getMonth(),closureDate.getDate());
  startDate.setDate(startDate.getDate()+extraday);
  let endDate:Date=new Date(startDate.getMonth()>2?startDate.getFullYear()+1:startDate.getFullYear(),2,31);
  let diff:Date=new Date(endDate.valueOf()-startDate.valueOf())
  let days=diff.valueOf()/1000/60/60/24;
  return ((amount*12)/264) * days;
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


}
