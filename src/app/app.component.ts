import { Component,OnInit, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  implements OnInit,OnDestroy{
  private authSub:Subscription;
  private _previousAuthState=false;
  userName:string;
  isadmin:boolean=false;
  constructor(  private authService:AuthService,
    private firebaseAuth:AngularFireAuth,
    private navCtrl: NavController,
    private platform: Platform,
    private router:Router,
    private fcmService:FcmService
    ) {
    }
    ngOnInit(){
      this.isadmin=false;
      this.authSub=this.authService.userdetail.subscribe(isAuth=>{
        console.log(isAuth.isAutheticated);
        if(!isAuth.isAutheticated && this._previousAuthState!==isAuth.isAutheticated){
          this.router.navigateByUrl('/auth');
        }
        else{
          this._previousAuthState=isAuth.isAutheticated;
          this.userName=isAuth.name;
          if(isAuth.roles && isAuth.roles.filter(u=>u=="admin").length>0){
            this.isadmin=true;
          }
        }
      });
      this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      console.log("I am ready");
      this.fcmService.initPush();
      // this.firebaseAuth.onAuthStateChanged(user => {
      //   if (user) {
      //   console.log('auth state changed');
      //   console.log(user);
      //   }
      // });
    });
  }


  onLogout(){
    this.authService.logout();
    this.navCtrl.navigateBack('/auth');

  }
  ngOnDestroy(){
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

}
