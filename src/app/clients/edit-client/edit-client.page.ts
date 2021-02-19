import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.page.html',
  styleUrls: ['./edit-client.page.scss'],
})
export class EditClientPage implements OnInit,OnDestroy {
  form: FormGroup;
  client:Client;
  clientSub:Subscription;
  isLoading=false;
  clientId:string;
  constructor(private route:ActivatedRoute,private navCtrl:NavController,
    private clientService:ClientService,private router:Router,
    private loadingCtrl:LoadingController,private alertCtrl:AlertController) { }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("clientId")) {
        this.navCtrl.navigateBack("/clients");
      }
      this.clientId=paramMap.get("clientId");
      this.isLoading=true;
      this.clientSub= this.clientService.getClient(paramMap.get("clientId")).subscribe(client=>{
      this.client = client;
      this.form = new FormGroup({
        name: new FormControl(this.client.name, {
          updateOn: "blur",
          validators: [Validators.required],
        }),
        type: new FormControl(this.client.type, {
          updateOn: "blur",
          validators: [Validators.required],
        }),
        contactPerson: new FormControl(this.client.contactPerson, {
          updateOn: "blur",
          validators: [Validators.required],
        }),
        contactNumber: new FormControl(this.client.contactNumber, {
          updateOn: "blur",
          validators: [Validators.required, Validators.min(1)],
        }),
        email: new FormControl(this.client.email, {
          updateOn: "blur",
          validators: [Validators.required,Validators.email],
        }),
        potentialNature: new FormControl(this.client.potentialNature, {
          updateOn: "blur",
          validators: [Validators.required],
        }),
        accountOwner: new FormControl(this.client.accountOwner, {
          updateOn: "blur",
          validators: [Validators.required],
        }), 
      });
      this.isLoading=false;
     },error=>{
this.alertCtrl.create({
  header: "An error occured",
  message: "Client could not be fetch. Please try that later.",
  buttons:[{text:'Okay',handler:()=>{
    this.router.navigate(['/clients']);
  }
}]
}).then(alerEl=>{
  alerEl.present();
});
     }); 
    });  
  
  }
onUpdateClient(){
  if (!this.form.valid) return;
   
  this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
    loadingEl.present();
    this.clientService
      .editClient(
        this.client.id,
        this.form.value.name,
        this.form.value.type,
        this.form.value.contactPerson,
        this.form.value.contactNumber,
        this.form.value.email,
        this.form.value.potentialNature,
        this.form.value.accountOwner,
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.router.navigate(["/clients"]);
      });
  });
}
  ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
  }

}
