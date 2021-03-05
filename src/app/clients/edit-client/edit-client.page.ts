import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { Division } from 'src/app/models/division.model';
import { DivisionService } from 'src/app/services/division.service';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

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

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private clientService: ClientService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private divisionService: DivisionService
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('clientId')) {
        this.navCtrl.navigateBack('/clients');
      }
      this.clientId = paramMap.get('clientId');
      this.isLoading = true;
      this.loadClient(this.clientId);
    });
  }

  loadClient(clientId) {
    this.clientSub = combineLatest([
      this.clientService.getClient(clientId),
      this.divisionService.fetchDivisions(),
    ]).subscribe(
      (res) => {
        this.client = res[0];
        this.divisionList = res[1];
        this.form = new FormGroup({
          divisionId: new FormControl(this.client.divisionId, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          name: new FormControl(this.client.name, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          type: new FormControl(this.client.type, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          contactPerson: new FormControl(this.client.contactPerson, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          contactNumber: new FormControl(this.client.contactNumber, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.min(1)],
          }),
          email: new FormControl(this.client.email, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.email],
          }),
          potentialNature: new FormControl(this.client.potentialNature, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          accountOwner: new FormControl(this.client.accountOwner, {
            updateOn: 'blur',
            validators: [Validators.required],
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

  onUpdateClient() {
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
          this.form.value.divisionId,
          this.divisionList.filter(div=>div.id==this.form.value.divisionId)[0].name,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          new Date()
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.router.navigate(['/clients']);
        });
    });
  }
  ionViewWillEnter() {}

  ngOnDestroy() {
    if (this.clientSub) {
      this.clientSub.unsubscribe();
    }
  }
}
