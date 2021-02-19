import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  constructor(private clientService:ClientService,private route:Router,private loadingCtrl:LoadingController) { }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      type: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      contactPerson: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      contactNumber: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)],
      }),
      email: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required,Validators.email],
      }),
      potentialNature: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }),
      accountOwner: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required],
      }), 
    });
  }

  onAddClient(){
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.clientService.addClient(
        this.form.value.name,
        this.form.value.type,
        this.form.value.contactPerson,
        this.form.value.contactNumber,
        this.form.value.email,
        this.form.value.potentialNature,
        this.form.value.accountOwner
        ).subscribe(()=>{
        this.isLoading = false;
        loadingEl.dismiss();
        this.form.reset();
        this.route.navigate(["/clients"]);
      })
      
    });
  }

}
