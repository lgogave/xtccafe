import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
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
  constructor(
    private demoRequestService: DemoRequestService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('demoId')) {
        this.navCtrl.navigateBack('/salespipeline/demorequests');
        return;
      }
      this.demoId = paramMap.get('demoId');
      this.isLoading = true;
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.demoRequestService.getDemoRequestById(this.demoId).subscribe((res) => {
      this.demoRequest = res;
      var result = this.initializeForm();
      this.isLoading = false;
    });
  }
  initializeForm() {
    this.form = new FormGroup({
      orgName: new FormControl(this.demoRequest.orgName, { updateOn: 'blur' }),
      orgStatus: new FormControl(this.demoRequest.orgStatus, {
        updateOn: 'blur',
      }),
      address: new FormControl(this.demoRequest.address, { updateOn: 'blur' }),
      addLocation: new FormControl(this.demoRequest.addLocation, {
        updateOn: 'blur',
      }),
      addPincode: new FormControl(this.demoRequest.addPincode, {
        updateOn: 'blur',
      }),
      addState: new FormControl(this.demoRequest.addState, {
        updateOn: 'blur',
      }),
      billAddress: new FormControl(this.demoRequest.billAddress, {
        updateOn: 'blur',
      }),
      billLocation: new FormControl(this.demoRequest.billLocation, {
        updateOn: 'blur',
      }),
      billPincode: new FormControl(this.demoRequest.billPincode, {
        updateOn: 'blur',
      }),
      billState: new FormControl(this.demoRequest.billState, {
        updateOn: 'blur',
      }),
      delAddress: new FormControl(this.demoRequest.delAddress, {
        updateOn: 'blur',
      }),
      delLocation: new FormControl(this.demoRequest.delLocation, {
        updateOn: 'blur',
      }),
      delPincode: new FormControl(this.demoRequest.delPincode, {
        updateOn: 'blur',
      }),
      delState: new FormControl(this.demoRequest.delState, {
        updateOn: 'blur',
      }),
      conName: new FormControl(this.demoRequest.conName, { updateOn: 'blur' }),
      conMobile: new FormControl(this.demoRequest.conMobile, {
        updateOn: 'blur',
      }),
      conLandline: new FormControl(this.demoRequest.conLandline, {
        updateOn: 'blur',
      }),
      conEmail: new FormControl(this.demoRequest.conEmail, {
        updateOn: 'blur',
      }),
      conRef: new FormControl(this.demoRequest.conRef, { updateOn: 'blur' }),
      mchModel: new FormControl(this.demoRequest.mchModel, {
        updateOn: 'blur',
      }),
      mchNoMachine: new FormControl(this.demoRequest.mchNoMachine, {
        updateOn: 'blur',
      }),
      mchType: new FormControl(this.demoRequest.mchType, { updateOn: 'blur' }),
      accInstallation: new FormControl(this.demoRequest.accInstallation, {
        updateOn: 'blur',
      }),
      accOther: new FormControl(this.demoRequest.accOther, {
        updateOn: 'blur',
      }),
      installation: new FormControl(this.demoRequest.installation, {
        updateOn: 'blur',
      }),
      instDemo: new FormControl(this.demoRequest.instDemo, {
        updateOn: 'blur',
      }),
      rate: new FormControl(this.demoRequest.rate, { updateOn: 'blur' }),
      rategst: new FormControl(this.demoRequest.rategst, { updateOn: 'blur' }),
      rateamount: new FormControl(this.demoRequest.rateamount, {
        updateOn: 'blur',
      }),
      rentTerm: new FormControl(this.demoRequest.rentTerm, {
        updateOn: 'blur',
      }),
      rentRateMonth: new FormControl(this.demoRequest.rentRateMonth, {
        updateOn: 'blur',
      }),
      rentamount: new FormControl(this.demoRequest.rentamount, {
        updateOn: 'blur',
      }),
      depApplicable: new FormControl(this.demoRequest.depApplicable, {
        updateOn: 'blur',
      }),
      depAmount: new FormControl(this.demoRequest.depAmount, {
        updateOn: 'blur',
      }),
      payTerms: new FormControl(this.demoRequest.payTerms, {
        updateOn: 'blur',
      }),
      payCreditPeriod: new FormControl(this.demoRequest.payCreditPeriod, {
        updateOn: 'blur',
      }),
      payCreditLimit: new FormControl(this.demoRequest.payCreditLimit, {
        updateOn: 'blur',
      }),
      payModel: new FormControl(this.demoRequest.payModel, {
        updateOn: 'blur',
      }),
      comApplicable: new FormControl(this.demoRequest.comApplicable, {
        updateOn: 'blur',
      }),
      comQuantity: new FormControl(this.demoRequest.comQuantity, {
        updateOn: 'blur',
      }),
      comTerm: new FormControl(this.demoRequest.comTerm, { updateOn: 'blur' }),
      dateDelivery: new FormControl(this.demoRequest.dateDelivery, {
        updateOn: 'blur',
      }),
      dateInstallation: new FormControl(this.demoRequest.dateInstallation, {
        updateOn: 'blur',
      }),
      dateDemo: new FormControl(this.demoRequest.dateDemo, {
        updateOn: 'blur',
      }),
      dateNoDays: new FormControl(this.demoRequest.dateNoDays, {
        updateOn: 'blur',
      }),
      datePickup: new FormControl(this.demoRequest.datePickup, {
        updateOn: 'blur',
      }),
      dateDeliveryAsPer: new FormControl(this.demoRequest.dateDeliveryAsPer, {
        updateOn: 'blur',
      }),
      dateDeliveryCharge: new FormControl(this.demoRequest.dateDeliveryCharge, {
        updateOn: 'blur',
      }),
      satPANNo: new FormControl(this.demoRequest.satPANNo, {
        updateOn: 'blur',
      }),
      satGSTNo: new FormControl(this.demoRequest.satGSTNo, {
        updateOn: 'blur',
      }),
      satSEZ: new FormControl(this.demoRequest.satSEZ, { updateOn: 'blur' }),
      bankAccName: new FormControl(this.demoRequest.bankAccName, {
        updateOn: 'blur',
      }),
      bankAddress: new FormControl(this.demoRequest.bankAddress, {
        updateOn: 'blur',
      }),
      bankAccNo: new FormControl(this.demoRequest.bankAccNo, {
        updateOn: 'blur',
      }),
      bankBranch: new FormControl(this.demoRequest.bankBranch, {
        updateOn: 'blur',
      }),
      bankIFSCCode: new FormControl(this.demoRequest.bankIFSCCode, {
        updateOn: 'blur',
      }),
      instaRequirement: new FormControl(this.demoRequest.instaRequirement, {
        updateOn: 'blur',
      }),
      cnsNoEmp: new FormControl(this.demoRequest.cnsNoEmp, {
        updateOn: 'blur',
      }),
      cnsNoCups: new FormControl(this.demoRequest.cnsNoCups, {
        updateOn: 'blur',
      }),
      manApplicable: new FormControl(this.demoRequest.manApplicable, {
        updateOn: 'blur',
      }),
      manNoOfManpower: new FormControl(this.demoRequest.manNoOfManpower, {
        updateOn: 'blur',
      }),
      manTerms: new FormControl(this.demoRequest.manTerms, {
        updateOn: 'blur',
      }),
      manRateTax: new FormControl(this.demoRequest.manRateTax, {
        updateOn: 'blur',
      }),
      matDelivery: new FormControl(this.demoRequest.matDelivery, {
        updateOn: 'blur',
      }),
      matBilling: new FormControl(this.demoRequest.matBilling, {
        updateOn: 'blur',
      }),
      matBillType: new FormControl(this.demoRequest.matBillType, {
        updateOn: 'blur',
      }),
      matStatutory: new FormControl(this.demoRequest.matStatutory, {
        updateOn: 'blur',
      }),
      subBillType: new FormControl(this.demoRequest.subBillType, {
        updateOn: 'blur',
      }),
      submission: new FormControl(this.demoRequest.submission, {
        updateOn: 'blur',
      }),
      subMethod: new FormControl(this.demoRequest.subMethod, {
        updateOn: 'blur',
      }),
      subDocs: new FormControl(this.demoRequest.subDocs, { updateOn: 'blur' }),
      subDueDate: new FormControl(this.demoRequest.subDueDate, {
        updateOn: 'blur',
      }),
      outML: new FormControl(this.demoRequest.outML, { updateOn: 'blur' }),
      outGrammage: new FormControl(this.demoRequest.outGrammage, {
        updateOn: 'blur',
      }),
      detXTCoffeeQty: new FormControl(this.demoRequest.detXTCoffeeQty, {
        updateOn: 'blur',
      }),
      detXTCoffeeUOM: new FormControl(this.demoRequest.detXTCoffeeUOM, {
        updateOn: 'blur',
      }),
      detXTCoffeeRate: new FormControl(this.demoRequest.detXTCoffeeRate, {
        updateOn: 'blur',
      }),
      detSugarQty: new FormControl(this.demoRequest.detSugarQty, {
        updateOn: 'blur',
      }),
      detSugarUOM: new FormControl(this.demoRequest.detSugarUOM, {
        updateOn: 'blur',
      }),
      detSugarRate: new FormControl(this.demoRequest.detSugarRate, {
        updateOn: 'blur',
      }),
      detTeaBagsQty: new FormControl(this.demoRequest.detTeaBagsQty, {
        updateOn: 'blur',
      }),
      detTeaBagsUOM: new FormControl(this.demoRequest.detTeaBagsUOM, {
        updateOn: 'blur',
      }),
      detTeaBagsRate: new FormControl(this.demoRequest.detTeaBagsRate, {
        updateOn: 'blur',
      }),
      detTeaBlendQty: new FormControl(this.demoRequest.detTeaBlendQty, {
        updateOn: 'blur',
      }),
      detTeaBlendUOM: new FormControl(this.demoRequest.detTeaBlendUOM, {
        updateOn: 'blur',
      }),
      detTeaBlendRate: new FormControl(this.demoRequest.detTeaBlendRate, {
        updateOn: 'blur',
      }),
      detFilCoffeeQty: new FormControl(this.demoRequest.detFilCoffeeQty, {
        updateOn: 'blur',
      }),
      detFilCoffeeUOM: new FormControl(this.demoRequest.detFilCoffeeUOM, {
        updateOn: 'blur',
      }),
      detFilCoffeeRate: new FormControl(this.demoRequest.detFilCoffeeRate, {
        updateOn: 'blur',
      }),
      detStirrerQty: new FormControl(this.demoRequest.detStirrerQty, {
        updateOn: 'blur',
      }),
      detStirrerUOM: new FormControl(this.demoRequest.detStirrerUOM, {
        updateOn: 'blur',
      }),
      detStirrerRate: new FormControl(this.demoRequest.detStirrerRate, {
        updateOn: 'blur',
      }),
      detPaperCupsQty: new FormControl(this.demoRequest.detPaperCupsQty, {
        updateOn: 'blur',
      }),
      detPaperCupsUOM: new FormControl(this.demoRequest.detPaperCupsUOM, {
        updateOn: 'blur',
      }),
      detPaperCupsRate: new FormControl(this.demoRequest.detPaperCupsRate, {
        updateOn: 'blur',
      }),
      billBranch: new FormControl(this.demoRequest.billBranch, {
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
    demoRequest.reqStatus = 'Demo Request Created';
    demoRequest.id = this.demoRequest.id;
    demoRequest.salespipelineId = this.demoRequest.salespipelineId;
    this.demoRequestService
      .editDemoRequest(demoRequest, this.demoId)
      .subscribe((res) => {
        console.log(res);
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
}


