import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})



export class AboutPage implements OnInit {
  name:string;
  version:string;
  packageName:string;
  versionCode:string|number;
  constructor(private platform:Platform) { }
  ngOnInit() {
   if(this.platform.is('cordova')){
    AppVersion.getAppName().then((value) => {
      this.name=value;
     });
     AppVersion.getVersionNumber().then((value) => {
      this.version=value;
     });
     AppVersion.getPackageName().then((value) => {
      this.packageName=value;
     });
     AppVersion.getVersionCode().then((value) => {
      this.versionCode=value;
     });
   }
   else{
    this.name="XTC cafe";
    this.version="1.0";
   }

  }

}
