import { Component,OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  implements OnInit,OnDestroy{
  private authSub:Subscription;
  private _previousAuthState=false;

  constructor(  private authService:AuthService,
    private router:Router) {

    }

    ngOnInit(){
      this.authSub=this.authService.userIsAutheticated.subscribe(isAuth=>{
        if(!isAuth && this._previousAuthState!==isAuth){
          this.router.navigateByUrl('/auth');
        }
        this._previousAuthState=isAuth;
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
