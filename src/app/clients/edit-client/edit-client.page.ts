import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { Division } from '../../models/division.model';
import { ClientTypeService } from '../../services/client-type.service';
import { DivisionService } from '../../services/division.service';
import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { PotentialnatureService } from 'src/app/services/potentialnature.service';
import { Potentialnature } from '../../models/Potentialnature.model';
import { LocationService } from '../../services/location.service';
import { ClientType } from '../../models/clientType.model';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.page.html',
  styleUrls: ['./edit-client.page.scss'],
})
export class EditClientPage implements OnInit, OnDestroy {
  form: FormGroup;
  client: Client;
  clientSub: Subscription;
  isLoading = false;
  clientId: string;
  clientDivision: string;
  divisionList: Division[];
  clientTypeList: ClientType[];
  potentialNatureList: Potentialnature[];
  locationList:Location[];
  countries:string[];
  regions:string[];
  subregions:string[];
  states:string[];
  cities:string[];
  clients:Client[];
  clientGroup:string[];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private clientService: ClientService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private divisionService: DivisionService,
    private clientTypeService:ClientTypeService,
    private potentialNatureService:PotentialnatureService,
    private locationService:LocationService
  ) {}
  async ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('clientId')) {
        this.navCtrl.navigateBack('/clients');
      }
      this.clientId = paramMap.get('clientId');
      this.isLoading = true;
      this.loadClient(this.clientId);
    });
  this.clients=await this.clientService.getClientList();
  this.clientGroup = this.clients
    .map((item) => item.group)
    .filter((value, index, self) => {
      if (value != null) return self.indexOf(value) === index;
    });
  }
  loadClient(clientId) {
    this.clientSub = combineLatest([
      this.clientService.getClient(clientId),
      this.divisionService.fetchDivisions(),
      this.clientTypeService.fetchclientTypes(),
      this.potentialNatureService.fetchPotentialnatures(),
      this.locationService.fetchLocations(),
    ]).subscribe(
      (res) => {
        this.client = res[0];
        this.divisionList = res[1];
        this.clientTypeList=res[2];
        this.potentialNatureList=res[3];
        this.locationList=res[4];
        let ncountry=this.client.country?this.client.country:null;
        let nregion=this.client.region?this.client.region:null;
        let nsubregion=this.client.subRegion?this.client.subRegion:null;
        let nstate=this.client.state?this.client.state:null;

        this.countries = this.locationList
        .map((item) => item.country)
        .filter((value, index, self) => self.indexOf(value) === index);

      if(ncountry!=null){
        this.regions = this.locationList
          .filter((item) => item.country === ncountry)
          .map((item) => item.region)
          .filter((value, index, self) => self.indexOf(value) === index);
      }

      if(nregion!=null){
        this.subregions = this.locationList
          .filter((item) => item.region === nregion)
          .map((item) => item.subregion)
          .filter((value, index, self) => self.indexOf(value) === index);
      }

      if(nsubregion!=null){
        this.states = this.locationList
          .filter((item) => item.subregion === nsubregion)
          .map((item) => item.state)
          .filter((value, index, self) => self.indexOf(value) === index);
      }

      if(nstate!=null){
        this.cities = this.locationList
          .filter((item) => item.state ===nstate)
          .map((item) => item.city)
          .filter((value, index, self) => self.indexOf(value) === index);
      }

        this.form = new FormGroup({
          divisionId: new FormControl(this.client.divisionIds?this.client.divisionIds:null, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          name: new FormControl(this.client.name?this.client.name:null, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          typeId: new FormControl(this.client.clientTypeIds?this.client.clientTypeIds:null, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          contactPerson: new FormControl(this.client.contactPerson?this.client.contactPerson:null, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          contactNumber: new FormControl(this.client.contactNumber?this.client.contactNumber:null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(1)],
          }),
          email: new FormControl(this.client.email?this.client.email:null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.email],
          }),
          potentialNatureId: new FormControl(this.client.potentialNatureId?this.client.potentialNatureId:null, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          accountOwner: new FormControl(this.client.accountOwner?this.client.accountOwner:null, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          gstNumber: new FormControl(this.client.gstNumber?this.client.gstNumber:null, {
            updateOn: 'blur',
            validators: [Validators.required,Validators.minLength(15)],
          }),
          employeeStrength: new FormControl(this.client.employeeStrength?this.client.employeeStrength:null, {
            updateOn: 'blur',
          }),
          cmbClientGroup: new FormControl(this.client.group?this.client.group:null, {
            updateOn: 'blur',
          }),
          clientGroup: new FormControl(null, {
            updateOn: 'blur',
          }),
          ddCountry: new FormControl(this.client.country?this.client.country:null, {
            updateOn: 'blur',
          }),
          ddRegion: new FormControl(this.client.region?this.client.region:null, {
            updateOn: 'blur',
          }),
          ddSubRegion: new FormControl(this.client.subRegion?this.client.subRegion:null, {
            updateOn: 'blur',
          }),
          ddState: new FormControl(this.client.state?this.client.state:null, {
            updateOn: 'blur',
          }),
          ddCity: new FormControl(this.client.city?this.client.city:null, {
            updateOn: 'blur',
          }),
        });
        this.isLoading = false;
      },
      (error) => {
        this.alertCtrl
          .create({
            header: 'An error occured',
            message: 'Client could not be fetch. Please try that later.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/clients']);
                },
              },
            ],
          })
          .then((alerEl) => {
            alerEl.present();
          });
      }
    );
  }

  updateNewGroup(){
    this.form.get('cmbClientGroup').reset();
  }


  onUpdateClient() {
    if (!this.form.valid) return;
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
let nlocId="";
let nlocation=this.locationList.filter(item=>
  item.country==(this.form.value.ddCountry==null?"":this.form.value.ddCountry) &&
  item.region==(this.form.value.ddRegion==null?"":this.form.value.ddRegion) &&
  item.subregion==(this.form.value.ddSubRegion==null?"":this.form.value.ddSubRegion) &&
  item.state==(this.form.value.ddState==null?"":this.form.value.ddState) &&
  item.city==(this.form.value.ddCity==null?"":this.form.value.ddCity)
);
if(nlocation.length>0){
  nlocId = nlocation[0].id;
}

let ndivisions:string[]=[];
if(this.form.value.divisionId.length>0){
  this.form.value.divisionId.forEach(element => {
  ndivisions.push(this.divisionList.filter(div=>div.id==element)[0].name)
  });
}

let nclientTypes: string[] = [];
if (this.form.value.typeId.length > 0) {
  this.form.value.typeId.forEach((element) => {
    nclientTypes.push(
      this.clientTypeList.filter((div) => div.id == element)[0].name
    );
  });
}

      this.clientService
        .editClient(
          this.client.id,
          this.form.value.name,
          this.form.value.contactPerson,
          this.form.value.contactNumber,
          this.form.value.email,
          this.potentialNatureList.filter(item=>item.id==this.form.value.potentialNatureId)[0].name,
          this.form.value.accountOwner,
          (this.form.value.cmbClientGroup==null?this.form.value.clientGroup:this.form.value.cmbClientGroup),
          this.form.value.gstNumber,
          this.form.value.employeeStrength,
          this.form.value.potentialNatureId,
          this.form.value.ddCountry==null?"":this.form.value.ddCountry,
          this.form.value.ddRegion==null?"":this.form.value.ddRegion,
          this.form.value.ddSubRegion==null?"":this.form.value.ddSubRegion,
          this.form.value.ddState==null?"":this.form.value.ddState,
          this.form.value.ddCity==null?"":this.form.value.ddCity,
          nlocId,
          new Date(),
          this.form.value.divisionId,
          ndivisions,
          this.form.value.typeId,
          nclientTypes
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.router.navigate(['/clients']);
        });
    });
  }

  onChangeCountry(event){
    let country=event.target.value;
    this.form.controls['ddRegion'].reset();
    this.form.controls['ddSubRegion'].reset();
    this.form.controls['ddState'].reset();
    this.form.controls['ddCity'].reset();


    this.regions=[];
    this.subregions=[];
    this.states=[];
    this.cities=[];
    this.regions=this.locationList.filter(item=>item.country===country).map(item=>item.region).filter((value, index, self) => self.indexOf(value) === index);
  }
  onChangeRegion(event){
    let region=event.target.value;
    this.form.controls['ddSubRegion'].reset();
    this.form.controls['ddState'].reset();
    this.form.controls['ddCity'].reset();
    this.subregions=null;
    this.states=null;
    this.cities=null;
    this.subregions=this.locationList.filter(item=>item.region===region).map(item=>item.subregion).filter((value, index, self) => self.indexOf(value) === index);
  }
  onChangeSubRegion(event){
    let subregion=event.target.value;
    this.form.controls['ddState'].reset();
    this.form.controls['ddCity'].reset();
    this.states=[];
    this.cities=[];
    this.states=this.locationList.filter(item=>item.subregion===subregion).map(item=>item.state).filter((value, index, self) => self.indexOf(value) === index);
  }
  onChangeStates(event){
    let state=event.target.value;
    this.form.controls['ddCity'].reset();
    this.cities=[];
    this.cities=this.locationList.filter(item=>item.state===state).map(item=>item.city).filter((value, index, self) => self.indexOf(value) === index);
  }


ionViewWillEnter() {

  }

  ngOnDestroy() {
    if (this.clientSub) {
      this.clientSub.unsubscribe();
    }
  }
}
