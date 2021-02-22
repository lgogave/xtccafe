import { Component, OnInit } from '@angular/core';
import { AuthService,AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLogin = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl:AlertController
  ) {}
  ngOnInit() {}

  authenticate(email:string,password:string) {
    this.loadingCtrl.create({ keyboardClose: true }).then((loadingEl) => {
      loadingEl.present();
      let authObs:Observable<AuthResponseData>;
if(this.isLogin){
  authObs=this.authService.login(email,password);
}
else{
  authObs=this.authService.signup(email,password);
}

authObs.subscribe(
  (resData) => {
    this.isLoading = false;
    loadingEl.dismiss();
    this.router.navigateByUrl("/home");
  },
  (errorRes) => {
    loadingEl.dismiss();
    const code = errorRes.message;
    let message = "Could not signup you up, please try again";
    if (code === "EMAIL_EXISTS") {
      message = "This Email address exist already.";
    }
    else if (code === "EMAIL_NOT_FOUND") {
      message = "Email addresscould not be found.";
    }
    else if (code === "INVALID_PASSWORD") {
      message = "Password is not valid.";
    }
    else if (code === "USER_DISABLED") {
      message = "User has been disabled. Kindly contact administrator.";
    }
    this.showAlert(message);
  }
);
    });
    this.isLoading = true;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;
   this.authenticate(email, password);
   form.reset();
  }
  onSwithAuthMode() {
    this.isLogin = !this.isLogin;
  }
  showAlert(msg:string)
  {
    this.alertCtrl
      .create({
        header: "Authentication failed",
        message: msg,
        buttons: ["Okay"],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
