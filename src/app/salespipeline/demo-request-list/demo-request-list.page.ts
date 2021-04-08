import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/auth/auth.service';
import { DemoRequest, DemoRequestViewModel } from 'src/app/models/demo-request.model';
import { DemoRequestService } from 'src/app/services/demo-request.service';
import { convertTimestampToDate, convertToDateTime } from '../../utilities/dataconverters';

@Component({
  selector: 'app-demo-request-list',
  templateUrl: './demo-request-list.page.html',
  styleUrls: ['./demo-request-list.page.scss'],
})
export class DemoRequestListPage implements OnInit, OnDestroy {
  private demoRequestsSub: Subscription;
  demoRequests: DemoRequestViewModel[];
  isLoading = false;
  userRoles:string[]=[];
  constructor(
    private demoRequestService: DemoRequestService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router,
    private authService:AuthService
  ) {}
  ngOnInit() {
    this.demoRequestsSub = this.demoRequestService.demoRequests.subscribe(
      (requests) => {
        this.demoRequests = requests;
      }
    );
    this.authService.userRoles.subscribe(roles=>{
      this.userRoles=roles;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.demoRequestService.fetchDemoRequest().subscribe((res) => {
      this.isLoading = false;
    });
  }
  doRefresh(event) {
    this.isLoading = true;
    this.demoRequestService.fetchDemoRequest().subscribe((res) => {
      this.isLoading = false;
      event.target.complete();
    });
  }

  onDelete(demoId: string, status: string, slidingEl: IonItemSliding) {
    if (status !== 'Demo Request Created') {
      this.toastController
        .create({
          message: 'Not allow to delete this request.',
          duration: 2000,
          color: 'danger',
        })
        .then((tost) => {
          tost.present();
          slidingEl.close();
        });
    } else {
      this.alertCtrl
        .create({
          header: 'Delete!',
          message: '<strong>Are you sure you want to delete ?</strong>',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                slidingEl.close();
              },
            },
            {
              text: 'Okay',
              handler: () => {
                slidingEl.close();
                this.loadingCtrl
                  .create({ keyboardClose: true, message: 'Deleteing...' })
                  .then((loadingEl) => {
                    loadingEl.present();
                    this.demoRequestService
                      .deleteDemoRequest(demoId)
                      .subscribe(() => {});
                    loadingEl.dismiss();
                  });
              },
            },
          ],
        })
        .then((alertEl) => {
          alertEl.present();
        });
    }
  }

  onEdit(demoId: string, status: string, slidingEl: IonItemSliding){
    if (status !== 'Demo Request Created' && status !== 'Rejected') {
      this.toastController
        .create({
          message: 'Not allow to edit this request.',
          duration: 2000,
          color: 'danger',
        })
        .then((tost) => {
          tost.present();
          slidingEl.close();
        });
    } else {
      this.router.navigate(['/salespipeline/editdemorequest/'+demoId]);
    }
  }

  ngOnDestroy() {
    if (this.demoRequestsSub) {
      this.demoRequestsSub.unsubscribe();
    }
  }

  getDate(date:any){
    return convertTimestampToDate(date)
  }
  getDateTime(date:any){
    return convertToDateTime(date);
  }

  sendForApproval(request:DemoRequestViewModel){
    // let req=this.demoRequests.filter(r=>r.docId==request.docId);
    // req[0].reqStatus='Sent for Approval';
    this.demoRequestService
      .updateDemoStatus(request.docId, 'Sent for Approval','')
      .subscribe();
    return;
    /*
    var emailobj = {
      to: 'jyoti.gogave@dwijafoods.com',
      from: 'jyoti.gogave@dwijafoods.com',
      subject: 'Demo request raised by Jyoti',
      location: [
        {
          city: req[0].addLocation,
          address: req[0].address,
          stDate:this.getDate(req[0].dateDemo),
          contact: 'Facility Team',
          machines:[{
            name:'FM',
            type:'Manual',
            category:'5 ltr',
            mchCount:'2'
          }]
        },
      ],
    };
    this.demoRequestService.sendEmail(emailobj).then((res)=>{
                 }).catch(erro=>{
                   console.log(erro);
                 });
*/
  }

  onApprove(request:DemoRequestViewModel,element){
  console.log(element.value);
  this.alertCtrl
    .create({
      header: 'Approve!',
      message: '<strong>Are you sure you want to Approve ?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Okay',
          handler: () => {
            this.loadingCtrl
              .create({ keyboardClose: true, message: 'Wait...' })
              .then((loadingEl) => {
                loadingEl.present();
                //db Call
                this.demoRequestService
                  .updateDemoStatus(
                    request.docId,
                    'Approved',
                    element.value != undefined ? element.value : '',
                    true
                  )
                  .subscribe(() => {
                    loadingEl.dismiss();
                  });
              });
          },
        },
      ],
    })
    .then((alertEl) => {
      alertEl.present();
    });
}
  onReject(request:DemoRequestViewModel,element){
    this.alertCtrl
    .create({
      header: 'Reject!',
      message: '<strong>Are you sure you want to Reject ?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.loadingCtrl
              .create({ keyboardClose: true, message: 'Wait...' })
              .then((loadingEl) => {
                loadingEl.present();
                this.demoRequestService
                .updateDemoStatus(
                  request.docId,
                  'Rejected',
                  element.value!=undefined?element.value:'',true
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
              });
          },
        },
      ],
    })
    .then((alertEl) => {
      alertEl.present();
    });
  }
}
