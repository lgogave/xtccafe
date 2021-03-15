import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { Client } from 'src/app/clients/client.model';
import { ClientService } from 'src/app/clients/client.service';
import { ClientSalesPipeline, Location, Machine, SalesPipeline } from '../salespipeline.model';
import { SalespipelineService, } from '../salespipeline.service';

@Component({
  selector: 'app-edit-sales',
  templateUrl: './edit-sales.page.html',
  styleUrls: ['./edit-sales.page.scss'],
})
export class EditSalesPage implements OnInit {
  form: FormGroup;
  formArray: FormArray;
  isLoading = false;
  loadedClients: Client[];
  entryForm: FormGroup;
  salesPipeline: ClientSalesPipeline;
  saleId: string;
  private salesPipeSub: Subscription;

  get locations() {
    return this.form.get('dataEntry') as FormArray;
  }
  addLocations() {
    this.locations.push(this.buildDataEntryForm());
  }
  deleteLocatios(index) {
    this.locations.removeAt(index);
  }

  getMachineDetails(fg: FormGroup) {
    let test = fg.get('machineDetails') as FormArray;
    return fg.get('machineDetails') as FormArray;
  }
  addMachineDetails(fg: FormGroup) {
    this.getMachineDetails(fg).push(this.buildMachineDetailForm());
  }
  deleteMachineDetails(fg: FormGroup, index) {
    this.getMachineDetails(fg).removeAt(index);
  }

  buildDataEntryForm(location?:Location,machines?:FormArray) {
    return new FormGroup({
      machineDetails:machines!=null?machines:new FormArray([this.buildMachineDetailForm()]),
      city: new FormControl(location!=null?location.city:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      address: new FormControl(location!=null?location.address:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      currentStatus: new FormControl(location!=null?location.currentStatus:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      closureDate: new FormControl(location!=null?this.salesPipelineService.convertTimeStampToDate(location.closureDate).toJSON():null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }
  buildMachineDetailForm(machine?:Machine) {
    return new FormGroup({
      machineName: new FormControl(machine!=null?machine.machineName:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      machineType: new FormControl(machine!=null?machine.machineType:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      volumeType: new FormControl(machine!=null?machine.machineCategory:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      machineCount: new FormControl(machine!=null?machine.machineCount:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      rate: new FormControl(machine!=null?machine.rate:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private clientService: ClientService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public toastController: ToastController,
    private salesPipelineService: SalespipelineService
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('salesId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.saleId = paramMap.get('salesId');
      this.isLoading = true;
      this.loadSalesPipeline(this.saleId);
    });
  }
loadSalesPipeline(saleId){
this.salesPipeSub=combineLatest([
  this.salesPipelineService.getClientSalesPipeline(saleId),
  this.clientService.fetchClients(),
]).subscribe((res)=>{
this.salesPipeline=res[0];
this.loadedClients=res[1];

let locationArray=new FormArray([]);
this.salesPipeline.locations.forEach((item,i)=>{
  let location=this.salesPipeline.locations[i];
  let machineArray=new FormArray([]);
  location.machines.forEach((item,j)=>{
    let machine=location.machines[j];
    machineArray.push(this.buildMachineDetailForm(machine))
  })
  locationArray.push(this.buildDataEntryForm(location,machineArray))
})


this.form = new FormGroup({
  dataEntry: locationArray,
  group: new FormControl(this.salesPipeline.group, {
    updateOn: 'blur',
  }),
  client: new FormControl(this.salesPipeline.clientId, {
    updateOn: 'blur',
    validators: [Validators.required],
  }),
  comments: new FormControl(this.salesPipeline.comment, {
    updateOn: 'blur',
    validators: [Validators.required, Validators.maxLength(180)],
  }),
});
console.log(this.form);
this.isLoading=false;
})

}


  ionViewWillEnter() {
    this.clientService.fetchClients().subscribe(() => {});
    this.salesPipelineService.getClientSalesPipeline(this.saleId);
  }
  async onUpdateSalespipeline() {
    // if (!this.form.valid) {
    //   return;
    // }


    let salesPipeline: SalesPipeline[] = this.AddSalesPipeline();
    let extSalepipe=await this.salesPipelineService.deleteSalesPipelineByClietId(this.form.value.client);
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      // Tree Structue Input
      this.AddClientSalesPipeLine();
      let arrayLength = salesPipeline.length - 1;
        salesPipeline.forEach((item, index) => {
          this.salesPipelineService
            .addSalesPipeline(item)
            .subscribe((response) => {
              console.log(index);
              if (arrayLength == index) {
                this.removeLoading(loadingEl);
              }
            });
        });
    });
  }
  removeLoading(loadingEl: HTMLIonLoadingElement) {
    this.isLoading = false;
    loadingEl.dismiss();
    this.form.reset();
    this.router.navigate(['/salespipeline']);
  }
  private AddClientSalesPipeLine() {
    let locations = [];
    for (let i = 0; i < this.form.value.dataEntry.length; i++) {
      let location = this.form.value.dataEntry[i];
      let machines = [];
      for (let j = 0; j < location.machineDetails.length; j++) {
        let machine = location.machineDetails[j];
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
      locations.push(
        new Location(
          location.city,
          location.address,
          location.currentStatus,
          new Date(location.closureDate),
          machines.map((obj) => {
            return Object.assign({}, obj);
          })
        )
      );
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
      locations.map((obj) => {
        return Object.assign({}, obj);
      })
    );
    this.salesPipelineService
      .editClientSalesPipeline(this.saleId,clientSalesPipeline)
      .subscribe((response) => {});
  }

  private AddSalesPipeline(): SalesPipeline[] {
    let salesPipeline: SalesPipeline[] = [];
    for (let i = 0; i < this.form.value.dataEntry.length; i++) {
      let location = this.form.value.dataEntry[i];
      for (let j = 0; j < location.machineDetails.length; j++) {
        let machine = location.machineDetails[j];
        salesPipeline.push(
          new SalesPipeline(
            '',
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
            '',
            new Date()
          )
        );
      }
    }
    return salesPipeline;
  }

  ngOnDestroy() {
    if (this.salesPipeSub) {
      this.salesPipeSub.unsubscribe();
    }
  }
}































































