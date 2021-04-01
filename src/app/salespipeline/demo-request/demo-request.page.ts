import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { DemoRequest } from 'src/app/models/demo-request.model';
import { DemoRequestService } from 'src/app/services/demo-request.service';
import { ClientSales } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';

@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.page.html',
  styleUrls: ['./demo-request.page.scss'],
})
export class DemoRequestPage implements OnInit {
  form: FormGroup;
  saleId: string;
  locationIndex: string;
  isLoading:boolean=false;
  clientSales:ClientSales;
  constructor(private route: ActivatedRoute,private navCtrl: NavController,private salespiplineService:SalespipelineService,
    private loadingCtrl: LoadingController,
    private demoRequestService:DemoRequestService,
    private toastController: ToastController,
    private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('salesId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      if (!paramMap.has('locationIndex')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.saleId = paramMap.get('salesId');
      this.locationIndex = paramMap.get('locationIndex');

      this.isLoading = true;
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
      orgName: new FormControl(this.clientSales.client.name, { updateOn: 'blur' }),
      orgStatus: new FormControl(this.clientSales.client.potentialNature, { updateOn: 'blur' }),
      address: new FormControl(this.clientSales.clientsale.locations[this.locationIndex].address, { updateOn: 'blur' }),
      addLocation: new FormControl(this.clientSales.clientsale.locations[this.locationIndex].city, { updateOn: 'blur' }),
      addPincode: new FormControl(null, { updateOn: 'blur' }),
      addState: new FormControl(null, { updateOn: 'blur' }),
      billAddress: new FormControl(null, { updateOn: 'blur' }),
      billLocation: new FormControl(null, { updateOn: 'blur' }),
      billPincode: new FormControl(null, { updateOn: 'blur' }),
      billState: new FormControl(null, { updateOn: 'blur' }),
      delAddress: new FormControl(null, { updateOn: 'blur' }),
      delLocation: new FormControl(null, { updateOn: 'blur' }),
      delPincode: new FormControl(null, { updateOn: 'blur' }),
      delState: new FormControl(null, { updateOn: 'blur' }),
      conName: new FormControl(null, { updateOn: 'blur' }),
      conMobile: new FormControl(null, { updateOn: 'blur' }),
      conLandline: new FormControl(null, { updateOn: 'blur' }),
      conEmail: new FormControl(null, { updateOn: 'blur' }),
      conRef: new FormControl(null, { updateOn: 'blur' }),
      mchModel: new FormControl(null, { updateOn: 'blur' }),
      mchNoMachine: new FormControl(null, { updateOn: 'blur' }),
      mchType: new FormControl(null, { updateOn: 'blur' }),
      accInstallation: new FormControl(null, { updateOn: 'blur' }),
      accOther: new FormControl(null, { updateOn: 'blur' }),
      installation: new FormControl(null, { updateOn: 'blur' }),
      instDemo: new FormControl(null, { updateOn: 'blur' }),
      rate: new FormControl(null, { updateOn: 'blur' }),
      rategst: new FormControl(null, { updateOn: 'blur' }),
      rateamount: new FormControl(null, { updateOn: 'blur' }),
      rentTerm: new FormControl(null, { updateOn: 'blur' }),
      rentRateMonth: new FormControl(null, { updateOn: 'blur' }),
      rentamount: new FormControl(null, { updateOn: 'blur' }),
      depApplicable: new FormControl(null, { updateOn: 'blur' }),
      depAmount: new FormControl(null, { updateOn: 'blur' }),
      payTerms: new FormControl(null, { updateOn: 'blur' }),
      payCreditPeriod: new FormControl(null, { updateOn: 'blur' }),
      payCreditLimit: new FormControl(null, { updateOn: 'blur' }),
      payModel: new FormControl(null, { updateOn: 'blur' }),
      comApplicable: new FormControl(null, { updateOn: 'blur' }),
      comQuantity: new FormControl(null, { updateOn: 'blur' }),
      comTerm: new FormControl(null, { updateOn: 'blur' }),
      dateDelivery: new FormControl(null, { updateOn: 'blur' }),
      dateInstallation: new FormControl(null, { updateOn: 'blur' }),
      dateDemo: new FormControl(null, { updateOn: 'blur' }),
      dateNoDays: new FormControl(null, { updateOn: 'blur' }),
      datePickup: new FormControl(null, { updateOn: 'blur' }),
      dateDeliveryAsPer: new FormControl(null, { updateOn: 'blur' }),
      dateDeliveryCharge: new FormControl(null, { updateOn: 'blur' }),
      satPANNo: new FormControl(null, { updateOn: 'blur' }),
      satGSTNo: new FormControl(null, { updateOn: 'blur' }),
      satSEZ: new FormControl(null, { updateOn: 'blur' }),
      bankAccName: new FormControl(null, { updateOn: 'blur' }),
      bankAddress: new FormControl(null, { updateOn: 'blur' }),
      bankAccNo: new FormControl(null, { updateOn: 'blur' }),
      bankBranch: new FormControl(null, { updateOn: 'blur' }),
      bankIFSCCode: new FormControl(null, { updateOn: 'blur' }),
      instaRequirement: new FormControl(null, { updateOn: 'blur' }),
      cnsNoEmp: new FormControl(null, { updateOn: 'blur' }),
      cnsNoCups: new FormControl(null, { updateOn: 'blur' }),
      manApplicable: new FormControl(null, { updateOn: 'blur' }),
      manNoOfManpower: new FormControl(null, { updateOn: 'blur' }),
      manTerms: new FormControl(null, { updateOn: 'blur' }),
      manRateTax: new FormControl(null, { updateOn: 'blur' }),
      matDelivery: new FormControl(null, { updateOn: 'blur' }),
      matBilling: new FormControl(null, { updateOn: 'blur' }),
      matBillType: new FormControl(null, { updateOn: 'blur' }),
      matStatutory: new FormControl(null, { updateOn: 'blur' }),
      subBillType: new FormControl(null, { updateOn: 'blur' }),
      submission: new FormControl(null, { updateOn: 'blur' }),
      subMethod: new FormControl(null, { updateOn: 'blur' }),
      subDocs: new FormControl(null, { updateOn: 'blur' }),
      subDueDate: new FormControl(null, { updateOn: 'blur' }),
      outML: new FormControl(null, { updateOn: 'blur' }),
      outGrammage: new FormControl(null, { updateOn: 'blur' }),
      billBranch: new FormControl(null, { updateOn: 'blur' }),
      detXTCoffeeQty: new FormControl(null, { updateOn: 'blur' }),
      detXTCoffeeUOM: new FormControl(null, { updateOn: 'blur' }),
      detXTCoffeeRate: new FormControl(null, { updateOn: 'blur' }),
      detSugarQty: new FormControl(null, { updateOn: 'blur' }),
      detSugarUOM: new FormControl(null, { updateOn: 'blur' }),
      detSugarRate: new FormControl(null, { updateOn: 'blur' }),
      detTeaBagsQty: new FormControl(null, { updateOn: 'blur' }),
      detTeaBagsUOM: new FormControl(null, { updateOn: 'blur' }),
      detTeaBagsRate: new FormControl(null, { updateOn: 'blur' }),
      detTeaBlendQty: new FormControl(null, { updateOn: 'blur' }),
      detTeaBlendUOM: new FormControl(null, { updateOn: 'blur' }),
      detTeaBlendRate: new FormControl(null, { updateOn: 'blur' }),
      detFilCoffeeQty: new FormControl(null, { updateOn: 'blur' }),
      detFilCoffeeUOM: new FormControl(null, { updateOn: 'blur' }),
      detFilCoffeeRate: new FormControl(null, { updateOn: 'blur' }),
      detStirrerQty: new FormControl(null, { updateOn: 'blur' }),
      detStirrerUOM: new FormControl(null, { updateOn: 'blur' }),
      detStirrerRate: new FormControl(null, { updateOn: 'blur' }),
      detPaperCupsQty: new FormControl(null, { updateOn: 'blur' }),
      detPaperCupsUOM: new FormControl(null, { updateOn: 'blur' }),
      detPaperCupsRate: new FormControl(null, { updateOn: 'blur' }),
    });
    return true;
  }

  addDemoRequest(){
    if (!this.form.valid) {
      return;
    }
    let demoRequest = <DemoRequest>this.form.value;
    demoRequest.reqStatus='Demo Request Created';
    let id=Math.floor(Math.random() * 26) + Date.now();
    demoRequest.id=id;
    demoRequest.salespipelineId=this.saleId;
    this.demoRequestService.addDemoRequest(demoRequest).subscribe((res) => {
      console.log(res);
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
}
