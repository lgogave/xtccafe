import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DemoRequest, DemoRequestViewModel } from 'src/app/models/demo-request.model';
import { DemoRequestService } from 'src/app/services/demo-request.service';
import { convertTimestampToDate, convertToDateTime } from '../../utilities/dataconverters';
import {Platform} from '@ionic/angular'
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs=pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-demo-request-list',
  templateUrl: './demo-request-list.page.html',
  styleUrls: ['./demo-request-list.page.scss'],
})
export class DemoRequestListPage implements OnInit, OnDestroy {
  private demoRequestsSub: Subscription;
  demoRequests: DemoRequestViewModel[];
  isLoading = false;
  userRoles: string[] = [];
  pdfObj = null;
  constructor(
    private demoRequestService: DemoRequestService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router,
    private authService: AuthService,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
  ) {}
  ngOnInit() {
    this.demoRequestsSub = this.demoRequestService.demoRequests.subscribe(
      (requests) => {
        this.demoRequests = requests;
      }
    );
    this.authService.userRoles.subscribe((roles) => {
      this.userRoles = roles;
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

  onEdit(demoId: string, status: string, slidingEl: IonItemSliding) {
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
      this.router.navigate(['/salespipeline/editdemorequest/' + demoId]);
    }
  }

  ngOnDestroy() {
    if (this.demoRequestsSub) {
      this.demoRequestsSub.unsubscribe();
    }
  }

  getDate(date: any) {
    return convertTimestampToDate(date);
  }
  getDateTime(date: any) {
    return convertToDateTime(date);
  }

  sendForApproval(request: DemoRequestViewModel) {
    this.alertCtrl
      .create({
        header: 'Send for Approval!',
        message:
          '<strong>Are you sure you want to send ReqId:' +
          request.id +
          ' for approval ?</strong>',
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
                    .updateDemoStatus(request.docId, 'Sent for Approval', '')
                    .subscribe(() => {
                      console.log('Email Called');
                      this.sendDemoEmail(request.docId);
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
    return;
  }

  async sendDemoEmail(reqId) {
    let user = await this.authService.userName.pipe(first()).toPromise();
    console.log(user);
    let approvers = await (
      await this.demoRequestService.getDemoApprovers()
    ).map((e) => e['email']);
    this.demoRequestService.getDemoRequestById(reqId).subscribe((res) => {
      var emailobj = {
        to: approvers,
        from: 'jyoti.gogave@dwijafoods.com',
        subject: 'Demo request raised by ' + user,
        raisedBy: user,
        request: res,
      };
      this.demoRequestService
        .sendEmail(emailobj)
        .then((res) => {})
        .catch((erro) => {
          console.log(erro);
        });
    });
  }

  onApprove(request: DemoRequestViewModel, element) {
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
  onReject(request: DemoRequestViewModel, element) {
    this.alertCtrl
      .create({
        header: 'Reject!',
        message: '<strong>Are you sure you want to Reject ?</strong>',
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
                  this.demoRequestService
                    .updateDemoStatus(
                      request.docId,
                      'Rejected',
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
  createPdf() {
    var docDefinition = {
      content: [
        // if you don't need styles, you can use a simple string to define a paragraph
        'This is a standard paragraph, using default style',
        // using a { text: '...' } object lets you set styling properties
        { text: 'This paragraph will have a bigger font', fontSize: 15 },
        // if you set the value of text to an array instead of a string, you'll be able
        // to style any part individually
        {
          text: [
            'This paragraph is defined as an array of elements to make it possible to ',
            { text: 'restyle part of it and make it bigger ', fontSize: 15 },
            'than the rest.',
          ],
        },
      ],
    };
    this.pdfObj = pdfMake.createPdf(docDefinition);
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var utf8 = new Uint8Array(buffer);
        var binaryArray = utf8.buffer;
        var blob = new Blob([binaryArray], { type: 'application/pdf' });
        this.file
          .writeFile(this.file.dataDirectory, 'myletter.pdf', blob, {
            replace: true,
          })
          .then((fileEntry) => {
            this.fileOpener
              .open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch((e) => console.log('Error opening file', e));
          });
      });
    } else {
      this.pdfObj.download();
    }
  }
}
