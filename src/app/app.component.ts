import { Component,OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  implements OnInit,OnDestroy{
  private authSub:Subscription;
  private _previousAuthState=false;
  userName:string;
  constructor(  private authService:AuthService,
    private firebaseAuth:AngularFireAuth,
    private platform: Platform,
    private router:Router) {
    }
    ngOnInit(){
      this.authSub=this.authService.userdetail.subscribe(isAuth=>{
        console.log(isAuth.isAutheticated);
        if(!isAuth.isAutheticated && this._previousAuthState!==isAuth.isAutheticated){
          this.router.navigateByUrl('/auth');
        }
        else{
          this._previousAuthState=isAuth.isAutheticated;
          this.userName=isAuth.name;
        }
      });
      //this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
        console.log('auth state changed');
        console.log(user);
        }
      });
    });
  }


  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

}
