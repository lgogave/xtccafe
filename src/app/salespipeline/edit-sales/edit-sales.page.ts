import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Salespipeline } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';
@Component({
  selector: 'app-edit-sales',
  templateUrl: './edit-sales.page.html',
  styleUrls: ['./edit-sales.page.scss'],
})
export class EditSalesPage implements OnInit, OnDestroy {
  form: FormGroup;
  salespipeline: Salespipeline;
  salespipelineSub: Subscription;
  isLoading = false;
  clientId: string;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private salespipelineService: SalespipelineService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('salesId')) {
        this.navCtrl.navigateBack('/salespipeline');
      }
      this.clientId = paramMap.get('salesId');
      this.isLoading = true;
      this.salespipelineSub = this.salespipelineService
        .getSalespipeline(paramMap.get('salesId'))
        .subscribe(
          (sales) => {
            this.salespipeline = sales;
            this.form = new FormGroup({
              client: new FormControl(this.salespipeline.client, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              brewer: new FormControl(this.salespipeline.brewer, {
                updateOn: 'blur',
                //validators: [Validators.required, Validators.min(0)],
              }),
              fm: new FormControl(this.salespipeline.fm, {
                updateOn: 'blur',
                //validators:  [Validators.required, Validators.min(0)],
              }),
              btoc: new FormControl(this.salespipeline.btoc, {
                updateOn: 'blur',
                //validators: [Validators.required, Validators.min(0)],
              }),
              preMix: new FormControl(this.salespipeline.preMix, {
                updateOn: 'blur',
                //validators:  [Validators.required, Validators.min(0)],
              }),
              mtrl: new FormControl(this.salespipeline.mtrl, {
                updateOn: 'blur',
                //validators: [Validators.required],
              }),
              amount: new FormControl(this.salespipeline.amount, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(0)],
              }),
              currentStatus: new FormControl(this.salespipeline.currentStatus, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              potentialStatus: new FormControl(
                this.salespipeline.potentialStatus,
                {
                  updateOn: 'blur',
                  validators: [Validators.required],
                }
              ),
              closuredate: new FormControl(
                new Date(this.salespipeline.closuredate).toISOString(),
                {
                  updateOn: 'blur',
                  validators: [Validators.required],
                }
              ),
              region: new FormControl(this.salespipeline.region, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              location: new FormControl(this.salespipeline.location, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              comments: new FormControl(this.salespipeline.comments, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)],
              }),
              win: new FormControl(this.salespipeline.win, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              value: new FormControl(this.salespipeline.value, {
                updateOn: 'blur',
                //validators: [Validators.required],
              }),
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occured',
                message:
                  'Salespipeline could not be fetch. Please try that later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/salespipeline']);
                    },
                  },
                ],
              })
              .then((alerEl) => {
                alerEl.present();
              });
          }
        );
    });
  }
  onUpdateSalespipeline() {
    if (!this.form.valid) return;

    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      this.salespipelineService
        .editSalespipeline(
          this.salespipeline.id,
          this.form.value.client,
          this.form.value.brewer,
          this.form.value.fm,
          this.form.value.btoc,
          this.form.value.preMix,
          this.form.value.mtrl,
          this.form.value.amount,
          this.form.value.currentStatus,
          this.form.value.potentialStatus,
          new Date(this.form.value.closuredate),
          this.form.value.region,
          this.form.value.location,
          this.form.value.comments,
          this.form.value.win,
          this.form.value.value
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.router.navigate(['/salespipeline']);
        });
    });
  }



  ngOnDestroy() {
    if (this.salespipelineSub) {
      this.salespipelineSub.unsubscribe();
    }
  }
}

