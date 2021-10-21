import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { GetNewId } from 'src/app/utilities/dataconverters';
import { Client } from '../../clients/client.model';
import { ClientService } from '../../clients/client.service';
import { ClientStatus, MachineDetail, MastAccOwner, MastBranch } from '../../models/division.model';
import { DivisionService } from '../../services/division.service';
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
  clients:Client[];
  clientGroup:string[];
  clientsStatus:ClientStatus[];
  entryForm: FormGroup;
  salesPipeline: ClientSalesPipeline;
  saleId: string;
  clientId: string;
  amt:number;
  machineDetail:MachineDetail[];
  machines:string[]
  machineType:string[]
  machineCategory:string[]
  lastComment:string;
  branches:MastBranch[];
  accowners:MastAccOwner[];
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
      branchcity: new FormControl(location!=null?location.branchcity:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      isConsumable: new FormControl(location!=null?location.isConsumable:null, {
        updateOn: 'blur',

      }),
      isRental: new FormControl(location!=null?location.isRental:null, {
        updateOn: 'blur',

      }),
      renLimit: new FormControl(location!=null?location.renLimit:null, {
        updateOn: 'blur',
      }),
      accowner:new FormControl(location!=null?location.accowner:null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      address: new FormControl(location!=null?location.address:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      installAt: new FormControl(location!=null?location.installAt:null, {
        updateOn: 'blur',
      }),
      installAddress: new FormControl(location!=null?location.installAddress:null, {
        updateOn: 'blur',
      }),
      branch: new FormControl(location!=null?location.branch:null, {
        updateOn: 'blur',
         validators: [Validators.required],
      }),
      currentStatus: new FormControl(location!=null?location.currentStatus:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      hiddencurrentStatus: new FormControl(location!=null?location.currentStatus:null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      closureDate: new FormControl(location!=null?this.salesPipelineService.convertTimeStampToDate(location.closureDate).toJSON():null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),

      amount: new FormControl(location!=null?location.amount:null, {
        updateOn: 'blur',
      }),
      billingAmount: new FormControl(location!=null?location.billingAmount:null, {
        updateOn: 'blur',
      }),
      machineCount: new FormControl(location!=null?location.machineCount:null, {
        updateOn: 'blur',
      }),
      id: new FormControl(location!=null?location.id:GetNewId(), {
        updateOn: 'blur',
      }),
    });
  }
  buildMachineDetailForm(machine?:Machine) {
    return new FormGroup({
      machineName: new FormControl(machine!=null?machine.machineName:null, {
        updateOn: 'blur',
      }),
      machineType: new FormControl(machine!=null?machine.machineType:null, {
        updateOn: 'blur',
      }),
      volumeType: new FormControl(machine!=null?machine.machineCategory:null, {
        updateOn: 'blur',
      }),
      machineCount: new FormControl(machine!=null?machine.machineCount:null, {
        updateOn: 'blur',
      }),
      machineSrNo: new FormControl(machine!=null?machine.machineSrNo:null, {
        updateOn: 'blur',
      }),
      machinehsncode: new FormControl(machine!=null?machine.machinehsncode:null, {
        updateOn: 'blur',
      }),
      rate: new FormControl(machine!=null?machine.rate:null, {
        updateOn: 'blur',
      }),
      amount: new FormControl(machine!=null?machine.amount:null, {
        updateOn: 'blur',
      }),
      conflevel: new FormControl(machine!=null?machine.conflevel:null, {
        updateOn: 'blur',
      }),
      billingAmount: new FormControl(machine!=null?machine.billingAmount:null, {
        updateOn: 'blur',
      }),
      mchRent: new FormControl(machine!=null?machine.mchRent:null, {
        updateOn: 'blur',
      }),
      consumableCap: new FormControl(machine!=null?machine.consumableCap:null, {
        updateOn: 'blur',
      }),
      mchInstCharges: new FormControl(machine!=null?machine.mchInstCharges:null, {
        updateOn: 'blur',
      }),
      isInstChargesConsider: new FormControl(machine!=null?machine.isInstChargesConsider:null, {
        updateOn: 'blur',
      }),
      mchSecDeposite: new FormControl(machine!=null?machine.mchSecDeposite:null, {
        updateOn: 'blur',
      }),
      pulloutDate: new FormControl(machine!=null?machine.pulloutDate:null, {
        updateOn: 'blur',
      }),
      pulloutreason: new FormControl(machine!=null?machine.pulloutreason:null, {
        updateOn: 'blur',
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
    private salesPipelineService: SalespipelineService,
    private divisionService:DivisionService,
  ) {}
  async ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('salesId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.saleId = paramMap.get('salesId');
    });
  }
    loadSalesPipeline(saleId){
    this.salesPipeSub=combineLatest([
      this.salesPipelineService.getClientSalesPipeline(saleId),
      this.clientService.getClientList(),
      this.divisionService.getClientStatusList(),
      this.divisionService.getMachineDetailList()
    ]).subscribe((res)=>{
    this.salesPipeline=res[0];
    this.clients=res[1];
    this.clientsStatus=res[2];
    this.machineDetail=res[3];
    this.machines=this.machineDetail.filter(item=>item.group==0).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
    this.machineType=this.machineDetail.filter(item=>item.group==1).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
    this.machineCategory=this.machineDetail.filter(item=>item.group==2).sort((a,b)=>a.srno-b.srno).map(item=>item.name);

    this.lastComment=res[0].comment;


    this.clientId=this.salesPipeline.clientId;
    if(this.salesPipeline.group!=null){
      this.loadedClients=this.clients.filter(item=> item.group===this.salesPipeline.group);
    }
    else {
      this.loadedClients=this.clients;
    }
    this.clientGroup = this.clients
      .map((item) => item.group)
      .filter((value, index, self) => {
        if (value != null) return self.indexOf(value) === index;
      });

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
      amount: new FormControl(this.salesPipeline.amount, {
        updateOn: 'blur',
      }),
      billingAmount: new FormControl(this.salesPipeline.billingAmount, {
        updateOn: 'blur',
      }),
      machineCount: new FormControl(this.salesPipeline.machineCount, {
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

    this.isLoading=false;
    })
    }


 async  ionViewWillEnter() {
    await this.loadBranches();
    await this.loadAccOwners();
    this.loadSalesPipeline(this.saleId);
    this.clientService.fetchClients().subscribe(() => {});
    this.salesPipelineService.getClientSalesPipeline(this.saleId);

  }

  async loadAccOwners(){
    this.accowners=await this.divisionService.getAccOwners();
    return true;
  }

  async loadBranches(){
    this.branches=await this.divisionService.getBranches();
    return true;
  }
  async onUpdateSalespipeline(redirection:boolean=true) {
    if (!this.form.valid) {
      return;
    }
    var exiclientId=await this.salesPipelineService.getClientById(this.form.value.client);
    console.log(exiclientId);
    if(exiclientId.length>0  && exiclientId[0]['clientId']!=this.clientId){
      await this.toastController.create({
       message: 'Client data is already exist.',
       duration: 2000,
       color:'danger',
     }).then((tost)=>{
       tost.present();
     });
     return;
    }


    let salesPipeline: SalesPipeline[] = this.AddSalesPipeline();
    let extSalepipe=await this.salesPipelineService.deleteSalesPipelineByClietId(this.clientId);
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      // Tree Structue Input
      this.AddClientSalesPipeLine(loadingEl,redirection);
      // let arrayLength = salesPipeline.length - 1;
      //   salesPipeline.forEach((item, index) => {
      //     this.salesPipelineService
      //       .addSalesPipeline(item)
      //       .subscribe((response) => {
      //         console.log(index);
      //         if (arrayLength == index) {
      //           this.removeLoading(loadingEl,redirection);
      //         }
      //       });
      //   });
    });
  }
  removeLoading(loadingEl: HTMLIonLoadingElement,redirection:boolean=true) {
    this.isLoading = false;
    loadingEl.dismiss();
    this.form.reset();
    if(redirection)
    this.router.navigate(['/salespipeline']);
  }
  private AddClientSalesPipeLine(loadingEl: HTMLIonLoadingElement,redirection:boolean=true) {
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
            machine.machineSrNo,
            machine.rate,
            machine.amount,
            machine.conflevel,
            machine.billingAmount,
            machine.mchRent,
            machine.consumableCap,
            machine.mchInstCharges,
            machine.mchSecDeposite,
            machine.isInstChargesConsider,
            machine.machinehsncode,
            machine.pulloutDate,
            machine.pulloutreason
          )
        );
      }
      locations.push(
        new Location(
          location.city,
          location.address,
          location.installAt,
          location.installAddress,
          location.currentStatus,
          new Date(location.closureDate),
          location.amount,
          machines.map((obj) => {
            return Object.assign({}, obj);
          }),
          location.billingAmount,
          location.machineCount,
          location.id,
          location.branch,
          location.accowner,
          location.branchcity,
          location.isConsumable,
          location.isRental,
          location.renLimit
        )
      );
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
      locations.map((obj) => {
        return Object.assign({}, obj);
      }),
      'edit',
      this.form.value.billingAmount,
      this.form.value.machineCount,
    );
    this.salesPipelineService
      .editClientSalesPipeline(this.saleId,clientSalesPipeline,this.lastComment)
      .subscribe((response) => {
        this.removeLoading(loadingEl,redirection);
      });
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
            '',
            new Date(),
            machine.conflevel,
            machine.machinehsncode
          )
        );
      }
    }
    return salesPipeline;
  }

  onChangeGroup(event){
    let grp=event.target.value;
    this.form.controls['client'].reset();
    this.loadedClients=[];
    this.loadedClients=this.clients.filter(item=>item.group===grp);
  }

  onMachineChange(event,element){
    if (!event.target.value) return;
    let ref = this.machineDetail.filter(
      (item) => item.name == event.target.value
    )[0].name;
    element.controls['volumeType'].reset();
    this.machineCategory = [];
    this.machineCategory = this.machineDetail
      .filter((item) => item.ref == ref && item.group == 2)
      .sort((a, b) => a.srno - b.srno)
      .map((item) => item.name);
    if (ref == 'FM' || ref == 'Mtl(kg/mth)') {
      element.controls['volumeType'].patchValue('Not Applicable', {
        emitEvent: false,
      });
    }
  }

    financialYearCalculation(closureDate:Date,amount:number){
      let extraday=7;
      let startDate:Date=new Date(closureDate.getFullYear(),closureDate.getMonth(),closureDate.getDate());
      startDate.setDate(startDate.getDate()+extraday);
      let endDate:Date=new Date(startDate.getMonth()>2?startDate.getFullYear()+1:startDate.getFullYear(),2,31);
      let diff:Date=new Date(endDate.valueOf()-startDate.valueOf())
      let days=diff.valueOf()/1000/60/60/24;
      return ((amount*12)/264)* days;
    }

    statusChange(event,element,index){
      if(event.target.value=='S3 : Demo initiated / done'){
        this.alertCtrl.create({
          header: 'Demo request!',
          message:
            '<strong>Are you sure you want to save and raise material requirement for Demo ?</strong>',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                let oldvalue = element.get('hiddencurrentStatus').value;
                element
                  .get('currentStatus')
                  .patchValue(oldvalue, { emitEvent: false });
              },
            },
            {
              text: 'Okay',
              handler:async () => {
                 await this.onUpdateSalespipeline(false)
                 this.router.navigate(['/salespipeline/demorequest/'+this.saleId+"/"+index]);
                //Redirect to the next page

              },
            },
          ],
        }).then((alertEl) => {
          alertEl.present();
        });
      }
      else{
        let curvalue=event.target.value;
        element.get('hiddencurrentStatus').patchValue(curvalue,{emitEvent: false});
      }
    }

  ngOnDestroy() {
    if (this.salesPipeSub) {
      this.salesPipeSub.unsubscribe();
    }
  }
}































































