import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.page.html',
  styleUrls: ['./detail-client.page.scss'],
})
export class DetailClientPage implements OnInit {
  isLoading=false;
  client:Client;
  clientId:any;
  constructor(private router:Router,private navCtrl:NavController,
    private modelCtrl:ModalController,
    private clientService:ClientService,
    private route:ActivatedRoute,
    private actionSheetCtrl:ActionSheetController,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private authService:AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('clientId')){
        this.navCtrl.navigateBack('/clients');
        return;
      }
      this.clientId=paramMap.get('clientId');
      this.isLoading=true;
      let fetchedUserId: string;
this.authService.userId.pipe(take(1),switchMap(userId=>{
  if(!userId){
    throw new Error('User not found!');
  }
  fetchedUserId=userId;
  return this.clientService.getClient(paramMap.get('clientId'));
})).subscribe(client=>{
        this.client=client;
        this.isLoading=false;
      });
    },error=>{
      this.alertCtrl.create({
        header: "An error occured",
        message: "Client could not be load. Please try that later.",
        buttons:[{text:'Okay',handler:()=>{
          this.router.navigate(['/clients']);
        }
      }]
      }).then(alerEl=>{
        alerEl.present();
      });
           });
  }

}
