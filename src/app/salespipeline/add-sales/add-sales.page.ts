import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/clients/client.model';
import { ClientService } from 'src/app/clients/client.service';
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

  get alternetEmail(){
    return this.form.get('dataEntry') as FormArray;
  }
  addAlternetEmail(){
    this.alternetEmail.push(this.buildDataEntryForm());
  }
  deleteAlternetEmail(index){
    this.alternetEmail.removeAt(index);
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


  constructor(private salespipeline:SalespipelineService,private route:Router,private loadingCtrl:LoadingController,private clientService:ClientService) { }
  ngOnInit() {
    this.clientSub = this.clientService.clients.subscribe((clients) => {
      this.loadedClients = clients;
    });
    this.form = new FormGroup({
      dataEntry: new FormArray([this.buildDataEntryForm()]),
      client: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      brewer: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required, Validators.min(0)],
      }),
      fm: new FormControl(null, {
        updateOn: "blur",
        //validators:  [Validators.required, Validators.min(0)],
      }),
      btoc: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required, Validators.min(0)],
      }),
      preMix: new FormControl(null, {
        updateOn: "blur",
        //validators:  [Validators.required, Validators.min(0)],
      }),
      mtrl: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
      amount: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(0)],
      }),
      currentStatus: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      potentialStatus: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      closuredate: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      region: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      comments: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      win: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      value: new FormControl(null, {
        updateOn: "blur",
        //validators: [Validators.required],
      }),
    });
  }
  ionViewWillEnter(){
    this.clientService.fetchClients().subscribe(() => {
    });
  }
  onAddSalespipeline(){
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.salespipeline.addSalespipeline(
        this.form.value.client,
        this.form.value.brewer,
        this.form.value.fm,
        this.form.value.btoc,
        this.form.value.preMix,
        this.form.value.mtrl,
        this.form.value.amount,
        this.form.value.currentStatus,
        this.form.value.potentialStatus,
        new Date(this.form.value.closuredate),
        this.form.value.region,
        this.form.value.location,
        this.form.value.comments,
        this.form.value.win,
        this.form.value.value
        ).subscribe(()=>{
        this.isLoading = false;
        loadingEl.dismiss();
        this.form.reset();
        this.route.navigate(["/salespipeline"]);
      })
    });
  }

  ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
  }

}
