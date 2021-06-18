import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Plugins} from '@capacitor/core';
const {PushNotifications}=Plugins;

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.page.html',
  styleUrls: ['./notification-detail.page.scss'],
})
export class NotificationDetailPage implements OnInit {
 id=null;
  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      this.id=params.get('id');
    })
  }
  removeBadgeCount(){
    PushNotifications.removeAllDeliveredNotifications();
  }
}
