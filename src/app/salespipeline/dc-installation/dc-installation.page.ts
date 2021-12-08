import { PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { MachineDetail, MastBranch, MastStock } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { getActiveYear } from 'src/app/utilities/dataconverters';
import { BillingDetail, BillingRate, ClientSales,DCAddHocMaterial,DCDetail,DCDetailModel,InstallDCDetail,Invoice,Location, ReceiptBook } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';


@Component({
  selector: 'app-dc-installation',
  templateUrl: './dc-installation.page.html',
  styleUrls: ['./dc-installation.page.scss'],
})
export class DcInstallationPage implements OnInit {
  form: FormGroup;
  clientSales:ClientSales;
  clientLocation:Location;
  isLoading:boolean=true;
  stockDetail:MastStock[];
  stockCategory:string[];
  materialstockType=[] as any;
  stockType:string[];
  perPipe:PercentPipe;
  saleId: string;
  dcId: string=null;
  locationId: string;
  billingDetail:BillingDetail;
  dcDetail:InstallDCDetail;
  branches:MastBranch[];
  machineDetail:MachineDetail[];
  machines:string[];
  machineType:string[];
  machineCategory:string[]

  constructor(private route: ActivatedRoute,private navCtrl: NavController,private divisionService:DivisionService,
    private loadingCtrl: LoadingController, private router: Router,private salespiplineService:SalespipelineService,
    private toastController: ToastController) { }

    async ngOnInit() {
      this.route.paramMap.subscribe(async (paramMap) => {
        if (!paramMap.has('salesId')) {
          this.navCtrl.navigateBack('/salespipeline');
        }
        if (!paramMap.has('locId')) {
          this.navCtrl.navigateBack('/salespipeline');
        }
        if (paramMap.has('dcId')) {
         this.dcId= paramMap.get('dcId');
        }
        this.saleId = paramMap.get('salesId');
        this.locationId = paramMap.get('locId');
        this.perPipe = new PercentPipe('en-US');
        if(this.dcId!=null){
          this.dcDetail = await this.salespiplineService.getDCDetail(this.dcId,1);
        }
        this.billingDetail=await this.salespiplineService.getBillingDetail(this.saleId,this.locationId);
        await this.loadBranches();
        await this.loadMachineDetails();

        this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
          loadingEl.present();
          this.salespiplineService
            .getSalesPipelineById(this.saleId)
            .subscribe((res) => {
              this.clientSales = res;
              this.clientSales.clientsale.locations.forEach(location => {
                if(location.id==this.locationId){
                  this.clientLocation=location;
                }
              });
              if(this.dcDetail==null)
              var result = this.initializeForm();
              else
              var result = this.initializeUpdateForm();
              loadingEl.dismiss();
              this.isLoading = false;
            });
        });
      });
    }
    initializeForm() {
      this.form = new FormGroup({
        billName: new FormControl(this.billingDetail!=null?this.billingDetail.billName:this.clientSales.client.name, { updateOn: 'blur',validators: [Validators.required] }),
        billAddress: new FormControl(this.clientLocation.address, { updateOn: 'blur' }),
        location: new FormControl(this.clientLocation.installAt, { updateOn: 'blur',validators: [Validators.required] }),
        address: new FormControl(this.clientLocation.installAddress, { updateOn: 'blur',validators: [Validators.required] }),
        pincode: new FormControl(this.billingDetail!=null?this.billingDetail.pincode:null, { updateOn: 'blur',validators: [Validators.required] }),
        branch: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        date: new FormControl(null, { updateOn: 'blur',validators: [Validators.required] }),
        machineDetails: this.buildMachineDetail(),
      });
      return true;
    }
    initializeUpdateForm() {
      this.form = new FormGroup({
        billName: new FormControl(this.dcDetail.billName, { updateOn: 'blur',validators: [Validators.required] }),
        billAddress: new FormControl(this.dcDetail.billAddress, { updateOn: 'blur',validators: [Validators.required] }),
        location: new FormControl(this.dcDetail.location, { updateOn: 'blur',validators: [Validators.required] }),
        address: new FormControl(this.dcDetail.address, { updateOn: 'blur',validators: [Validators.required] }),
        pincode: new FormControl(this.dcDetail.pincode, { updateOn: 'blur',validators: [Validators.required] }),
        branch: new FormControl(this.dcDetail.branch, { updateOn: 'blur',validators: [Validators.required] }),
        date: new FormControl(this.dcDetail.date, { updateOn: 'blur',validators: [Validators.required] }),
        machineDetails:this.updateMachineDetail(),
      });
      return true;
    }
    buildMachineDetail(){
      console.log(this.clientLocation);
      let machines= [];
      this.clientLocation.machines.forEach(element => {
        machines.push(
          new FormGroup({
            machineName: new FormControl(element.machineName, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineType: new FormControl(element.machineType, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineCategory: new FormControl(element.machineCategory, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineCount: new FormControl(element.machineCount, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineSrNo: new FormControl(element.machineSrNo, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machinehsncode: new FormControl(element.machinehsncode?element.machinehsncode:'', {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            mchInstCharges: new FormControl(element.mchInstCharges, {
              updateOn: "blur",
              //validators: [Validators.required],
            })
          })
        )
      });
      return new FormArray(machines)
    }
    updateMachineDetail(){
      let machines= [];
      this.dcDetail.machineDetails.forEach(element => {
        machines.push(
          new FormGroup({
            machineName: new FormControl(element.machineName, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineType: new FormControl(element.machineType, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineCategory: new FormControl(element.machineCategory, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineCount: new FormControl(element.machineCount, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machineSrNo: new FormControl(element.machineSrNo, {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            machinehsncode: new FormControl(element.machinehsncode?element.machinehsncode:'', {
              updateOn: "blur",
              //validators: [Validators.required],
            }),
            mchInstCharges: new FormControl(element.mchInstCharges, {
              updateOn: "blur",
              //validators: [Validators.required],
            })
          })
        )
      });
      return new FormArray(machines)
    }


    createMachineDetail(){
      return new FormGroup({
        machineName: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        machineType: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        machineCategory: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        machineCount: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        machineSrNo: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        machinehsncode: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        }),
        mchInstCharges: new FormControl(null, {
          updateOn: "blur",
          //validators: [Validators.required],
        })
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
    async loadBranches(){
      this.branches=await this.divisionService.getBranches();
      return true;
    }
    async loadMachineDetails(){
      this.machineDetail=await this.divisionService.getMachineDetailList();
      this.machines=this.machineDetail.filter(item=>item.group==0).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
      this.machineType=this.machineDetail.filter(item=>item.group==1).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
      this.machineCategory=this.machineDetail.filter(item=>item.group==2).sort((a,b)=>a.srno-b.srno).map(item=>item.name);
      return true;
    }
    onMachineChange(event,element){
      if (!event.target.value) return;
      let ref=this.machineDetail.filter(item=>item.name==event.target.value)[0].name;
      element.controls['machineCategory'].reset();
      this.machineCategory=[];
      this.machineCategory=this.machineDetail.filter(item=>item.ref==ref && item.group==2).sort(
        (a,b)=>a.srno-b.srno).map(item=>item.name);
        if(ref=="FM" || ref=="Mtl(kg/mth)"){
          element.controls['machineCategory'].patchValue("Not Applicable",{emitEvent: false})
        }
    }
    async  padLeadingZeros(num, size) {
      var s = num + '';
      while (s.length < size) s = '0' + s;
      return await s;
    }
    updateReceiptBook(receipt:ReceiptBook){
      this.salespiplineService.addupdateReceiptBook(receipt,receipt.id==null?false:true).subscribe()
    }
    async addDC(){
      if (!this.form.valid) {
        return;
      }



    if(this.dcId!=null)
    this.dcDetail = await this.salespiplineService.getDCDetail(this.dcId,1);
    let fmbillingDetail = <InstallDCDetail>this.form.value;
    let branch=this.branches.filter(x=>x.name==fmbillingDetail.branch)[0];
      fmbillingDetail.salesId=this.saleId;
      fmbillingDetail.clientId = this.clientSales.clientsale.clientId;
      fmbillingDetail.site=this.clientSales.clientsale.locations.filter(x=>x.id==this.locationId)[0].city;
      fmbillingDetail.locationId = this.locationId;
      fmbillingDetail.isDelete =false;
      if(this.billingDetail!=null){
        fmbillingDetail.id=this.billingDetail.id;
      }
      if (fmbillingDetail.machineDetails.length == 0) {
        return;
      }
      if(this.dcDetail==null){
        let receiptBook = new ReceiptBook();
        receiptBook.category = 'D';
        receiptBook.type = 'M';
        receiptBook.branch = branch.initials;
        receiptBook.year =  getActiveYear();
        let receiptNo = await this.salespiplineService.getlastReceiptNumber(receiptBook);
        if (receiptNo != null) {
          receiptBook.id = receiptNo.id;
          receiptBook.srnumber = receiptNo.srnumber + 1;
        } else {
          receiptBook.srnumber = 1;
          receiptBook.id = null;
        }
        let srNo = await this.padLeadingZeros(receiptBook.srnumber, 5);
        fmbillingDetail.srNo = `${receiptBook.category}/${receiptBook.type}/${branch.initials}/${receiptBook.year}/${srNo}`;
        fmbillingDetail.isUsed = false;
        fmbillingDetail.type=1;
        this.salespiplineService
          .addupdateDC(fmbillingDetail, false)
          .subscribe((res) => {
            this.toastController
              .create({
                message: 'Data updated',
                duration: 2000,
                color: 'success',
              })
              .then((tost) => {
                this.updateReceiptBook(receiptBook);
                tost.present();
                this.router.navigate([
                  '/salespipeline/deliverychallanlist/' +
                    fmbillingDetail.clientId,
                ]);
              });
          });
      }
      else
      {
        fmbillingDetail.srNo = this.dcDetail.srNo;
        fmbillingDetail.isUsed=this.dcDetail.isUsed;
        fmbillingDetail.id=this.dcId;
        let invoice:any=await this.salespiplineService.getInvoiceByDCId(this.dcDetail.id);
        this.updateInvoice(invoice,fmbillingDetail);
        this.salespiplineService
        .addupdateDC(fmbillingDetail,true)
        .subscribe((res) => {
          this.toastController
            .create({
              message: 'Data updated',
              duration: 2000,
              color: 'success',
            })
            .then((tost) => {
              tost.present();
              this.router.navigate(['/salespipeline/deliverychallanlist/'+fmbillingDetail.clientId]);
            });
        });
      }
    }
    async updateInvoice(invoice:Invoice,dc:DCDetail){
      if(invoice==null)
      return;
      let inx:any=0;
      invoice.dc.forEach((element,index)=> {
        if(element.id===dc.id)
        {
          inx=index;
        }
      });
      invoice.dc[inx]=<DCDetailModel>dc;

     let totamount:number=0; let tax:number=0;let amount:number=0;
      invoice.dc.forEach(dcelement => {
        dcelement['machineDetails'].forEach((material) => {
          amount = amount + material.amount;
          tax = tax + material.tax;
          totamount = totamount + amount + tax;
        });
      });
      invoice.amount=amount;
      invoice.tax=tax;
      invoice.totamount=totamount;
      this.salespiplineService.addupdateInvoice(invoice,true).subscribe();
    }
  }

