import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { ClientType } from '../../models/clientType.model';
import { Division } from '../../models/division.model';
import { Location } from '../../models/location.model';
import { ClientTypeService } from 'src/app/services/client-type.service';
import { DivisionService } from '../../services/division.service';
import { LocationService } from '../../services/location.service';
import { PotentialnatureService } from 'src/app/services/potentialnature.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  divisionList: Division[];
  clientTypeList: ClientType[];
  potentialNatureList: ClientType[];
  locationList:Location[];
  countries:string[];
  regions:string[];
  subregions:string[];
  states:string[];
  cities:string[];




  private divisionSub: Subscription;
  private clientTypeSub: Subscription;
  private potentialNatureSub: Subscription;
  private locationSub: Subscription;
  private mastSub: Subscription;

  constructor(
    private clientService: ClientService,
    private route: Router,
    private loadingCtrl: LoadingController,
    private divisionService: DivisionService,
    private clientTypeService:ClientTypeService,
    private potentialNatureService:PotentialnatureService,
    private locationService:LocationService
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      divisionId: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      typeId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      contactPerson: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      contactNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email],
      }),
      potentialNatureId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      accountOwner: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      gstNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required,Validators.minLength(15)],
      }),
      employeeStrength: new FormControl(null, {
        updateOn: 'blur',
      }),
      brewer: new FormControl(null, {
        updateOn: 'blur',

      }),
      fm: new FormControl(null, {
        updateOn: 'blur',

      }),
      btc: new FormControl(null, {
        updateOn: 'blur',

      }),
      preMix: new FormControl(null, {
        updateOn: 'blur',

      }),
      tapriMtrl: new FormControl(null, {
        updateOn: 'blur',

      }),
      amount: new FormControl(null, {
        updateOn: 'blur',
      }),
      clientGroup: new FormControl(null, {
        updateOn: 'blur',
      }),
      ddCountry: new FormControl(null, {
        updateOn: 'blur',
      }),
      ddRegion: new FormControl(null, {
        updateOn: 'blur',
      }),
      ddSubRegion: new FormControl(null, {
        updateOn: 'blur',
      }),
      ddState: new FormControl(null, {
        updateOn: 'blur',
      }),
      ddCity: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
    this.divisionSub = this.divisionService.divisions.subscribe((divisions) => {
      this.divisionList = divisions;
    });

    this.clientTypeSub = this.clientTypeService.clientTypes.subscribe((clientTypes) => {
      this.clientTypeList = clientTypes;
    });
   this.potentialNatureSub= this.potentialNatureService.potentialnatures.subscribe((potentialNatures) => {
    this.potentialNatureList = potentialNatures;
  });

  this.locationSub=this.locationService.locations.subscribe((locations) => {
  this.locationList = locations;
  this.countries=locations.map(item=>item.country).filter((value, index, self) => self.indexOf(value) === index);


});

  }

  onAddClient() {
    if (!this.form.valid) {
      return;
    }


    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.clientService
        .addClient(
          this.form.value.name,
          this.clientTypeList.filter(div=>div.id==this.form.value.typeId)[0].name,
          this.form.value.contactPerson,
          this.form.value.contactNumber,
          this.form.value.email,
          this.potentialNatureList.filter(item=>item.id==this.form.value.potentialNatureId)[0].name,
          this.form.value.accountOwner,
          this.form.value.divisionId,
          this.divisionList.filter(div=>div.id==this.form.value.divisionId)[0].name,
          this.form.value.typeId,
          '',
          this.form.value.gstNumber,
          this.form.value.potentialNatureId,
          this.form.value.brewer,
          this.form.value.fm,
          this.form.value.btc,
          this.form.value.preMix,
          this.form.value.tapriMtrl,
          this.form.value.amount,
          this.form.value.ddCountry==null?"":this.form.value.ddCountry,
          this.form.value.ddRegion==null?"":this.form.value.ddRegion,
          this.form.value.ddSubRegion==null?"":this.form.value.ddSubRegion,
          this.form.value.ddState==null?"":this.form.value.ddState,
          this.form.value.ddCity==null?"":this.form.value.ddCity,
          this.locationList.filter(item=>
            item.country==(this.form.value.ddCountry==null?"":this.form.value.ddCountry) &&
            item.region==(this.form.value.ddRegion==null?"":this.form.value.ddRegion) &&
            item.subregion==(this.form.value.ddSubRegion==null?"":this.form.value.ddSubRegion) &&
            item.state==(this.form.value.ddState==null?"":this.form.value.ddState) &&
            item.city==(this.form.value.ddCity==null?"":this.form.value.ddCity)
          )[0].id,
          new Date()
        )
        .subscribe(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.form.reset();
          this.route.navigate(['/clients']);
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



  ionViewWillEnter(){
    this.mastSub=combineLatest([
      this.divisionService.fetchDivisions(),
      this.clientTypeService.fetchclientTypes(),
      this.potentialNatureService.fetchPotentialnatures(),
      this.locationService.fetchLocations(),
    ]).subscribe(() => {
    });
  }

  ngOnDestroy() {
    if (this.divisionSub) {
      this.divisionSub.unsubscribe();
    }
    if (this.clientTypeSub) {
      this.clientTypeSub.unsubscribe();
    }
    if(this.locationSub)
    {
      this.locationSub.unsubscribe();
    }
    if (this.mastSub) {
      this.mastSub.unsubscribe();
    }

  }

}
