import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, observable, of, pipe } from 'rxjs';
import { first, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';


import{
Plugins,
PushNotification,
PushNotificationToken,
PushNotificationActionPerformed,
Capacitor,
} from '@capacitor/core'
import {Router} from '@angular/router';
import { UserNotification } from '../models/user-notification';
const {PushNotifications,Modals}=Plugins;
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(private router: Router,private firebaseService: AngularFirestore,  private authService: AuthService) {}
  public initPush() {
    console.log(Capacitor.platform);
    if (Capacitor.platform !== 'web') {
      console.log('registerPush Called');
      this.registerPush();
    }
  }
  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        PushNotifications.register();
      } else {
      }
    });

     PushNotifications.addListener(
      'registration',
      async(token: PushNotificationToken) =>  {
        console.log('My token:' + JSON.stringify(token));
         this.updateDeviceToken(token);
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      //console.log('Error:' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        //console.log('Push Received' + JSON.stringify(notification));
        let alert=Modals.alert({
          title:notification.title,
          message:notification.body
        });
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log(
          'Action performed:' + JSON.stringify(notification.notification)
        );
        console.log(data);
        if (data.detailsId) {
          this.router.navigateByUrl(`notificationdetail/${data.detailsId}`);
        }
      }
    );
  }



   updateDeviceToken(token) {
    console.log('Called');
    this.firebaseService
    .collection('user-devices')
    .add(Object.assign({}, new UserNotification('123',token.value,new Date()))).then(()=>{
      console.log('Called END');
    });
    // let snaps:any= await this.firebaseService
    //   .collection('user-devices', (ref) =>
    //   ref.where('userId','==',userId)
    //   .where('deviceToken','==',token))
    //   .snapshotChanges()
    //   .pipe(first())
    //   .toPromise();
    //  if(snaps.length<=0){

      // return this.firebaseService
      // .collection('user-devices')
      // .add(Object.assign({}, new UserNotification(userId,token.value,new Date()))).then(()=>{
      //   console.log("token udated");
      // });

     //}
  }
}
