import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Salespipeline } from '../salespipeline.model';
import { SalespipelineService } from '../salespipeline.service';
@Component({
  selector: 'app-detail-sales',
  templateUrl: './detail-sales.page.html',
  styleUrls: ['./detail-sales.page.scss'],
})
export class DetailSalesPage implements OnInit {
  isLoading=false;
  salespipeline:Salespipeline;
  salesId:any;
  constructor(private router:Router,private navCtrl:NavController,
    private modelCtrl:ModalController,
    private salespipelineService:SalespipelineService,
    private route:ActivatedRoute,
    private actionSheetCtrl:ActionSheetController,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private authService:AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('salesId')){
        this.navCtrl.navigateBack('/salespipeline');
        return;
      }
      this.salesId=paramMap.get('salesId');
      this.isLoading=true;
      let fetchedUserId: string;
this.authService.userId.pipe(take(1),switchMap(userId=>{
  if(!userId){
    throw new Error('User not found!');
  }
  fetchedUserId=userId;
  return this.salespipelineService.getSalespipeline(paramMap.get('salesId'));
})).subscribe(sales=>{
        this.salespipeline=sales;
        this.isLoading=false;
      });
    },error=>{
      this.alertCtrl.create({
        header: "An error occured",
        message: "Salespipeline could not be load. Please try that later.",
        buttons:[{text:'Okay',handler:()=>{
          this.router.navigate(['/salespipeline']);
        }
      }]
      }).then(alerEl=>{
        alerEl.present();
      });
           });
  }

}
