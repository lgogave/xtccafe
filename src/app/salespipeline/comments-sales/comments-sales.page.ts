import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientComment, ClientCommentModel, ClientSalesPipeline } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';
@Component({
  selector: 'app-comments-sales',
  templateUrl: './comments-sales.page.html',
  styleUrls: ['./comments-sales.page.scss'],
})
export class CommentsSalesPage implements OnInit {
  isLoading = false;
  comments: ClientCommentModel[];
  salesId: any;
  client: string;

  private commentsSub: Subscription;

  constructor(  private router: Router,
    private navCtrl: NavController,
    private modelCtrl: ModalController,
    private salespipelineService: SalespipelineService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService) { }

  ngOnInit() {

    this.route.paramMap.subscribe(
      (paramMap) => {
        if (!paramMap.has('salesId')) {
          this.navCtrl.navigateBack('/salespipeline');
          return;
        }
        this.salesId = paramMap.get('salesId');
        this.client= paramMap.get('client');
        console.log(this.client);
          this.commentsSub =this.salespipelineService.clientComments.subscribe((comments) => {
          this.comments=comments;
          });
      },
      (error) => {
        this.alertCtrl
          .create({
            header: 'An error occured',
            message: 'Salespipeline could not be load. Please try that later.',
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
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.salespipelineService.fetchClientCommets(this.salesId).subscribe((respones) => {
    console.log(respones);
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
  }
  convertTimestampToDate(date:any){
    return this.salespipelineService.convertTimeStampToDate(date);
   }
}
