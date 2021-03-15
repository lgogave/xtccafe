import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/clients/client.model';
import { ClientService } from 'src/app/clients/client.service';
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
  loadedClients:Client[];
  entryForm: FormGroup;

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
    currentStatus: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
    closureDate: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
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
    rate: new FormControl(null, {
      updateOn: "blur",
      validators: [Validators.required],
    }),
  });
}


  constructor(private salespipeline:SalespipelineService,private route:Router,private loadingCtrl:LoadingController,private clientService:ClientService,
  private salesPipelineService:SalespipelineService,) { }
  ngOnInit() {
    this.clientSub = this.clientService.clients.subscribe((clients) => {
      this.loadedClients = clients;
    });
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
    });
  }
  ionViewWillEnter(){
    this.clientService.fetchClients().subscribe(() => {
    });
  }
  onAddSalespipeline(){
    // if (!this.form.valid) {
    //   return;
    // }
    let salesPipeline:SalesPipeline[]=this.AddSalesPipeline();
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      // Tree Structue Input
      this.AddClientSalesPipeLine();
      let arrayLength=salesPipeline.length-1;
      salesPipeline.forEach((item,index)=>{
        this.salesPipelineService.addSalesPipeline(item).subscribe((response)=>{
          console.log(index);
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
            machine.rate
          )
        );
      }
      locations.push(new Location(location.city,
        location.address,
        location.currentStatus,
        new Date(location.closureDate),
        machines.map((obj)=> {return Object.assign({}, obj)})
        ))
    }
    let clientSalesPipeline: ClientSalesPipeline = new ClientSalesPipeline(
      '',
      this.form.value.group,
      this.form.value.client,
      this.loadedClients.filter(
        (item) => item.id == this.form.value.client
      )[0].name,
      this.form.value.comments,
      '',
      new Date(),
      locations.map((obj)=> {return Object.assign({}, obj)})
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
        this.loadedClients.filter(
          (item) => item.id == this.form.value.client
        )[0].name,
        this.form.value.comments,
        location.city,
        location.address,
        location.currentStatus,
        new Date(location.closureDate),
        machine.machineName,
        machine.machineType,
        machine.volumeType,
        machine.machineCount,
        machine.rate,
        "",
        new Date(),
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
}
