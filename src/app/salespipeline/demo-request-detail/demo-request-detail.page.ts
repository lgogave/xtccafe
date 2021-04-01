import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DemoRequest } from 'src/app/models/demo-request.model';
import { DemoRequestService } from 'src/app/services/demo-request.service';

@Component({
  selector: 'app-demo-request-detail',
  templateUrl: './demo-request-detail.page.html',
  styleUrls: ['./demo-request-detail.page.scss'],
})
export class DemoRequestDetailPage implements OnInit {
  demoRequest: DemoRequest;
  demoId: string;
  isLoading:boolean=false;
  constructor(
    private demoRequestService: DemoRequestService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('demoId')) {
        this.navCtrl.navigateBack('/salespipeline/demorequests');
        return;
      }
      this.demoId = paramMap.get('demoId');
      this.isLoading = true;
    });
  }
  ionViewWillEnter() {
    this.isLoading=true;
    this.demoRequestService.getDemoRequestById(this.demoId).subscribe((res) => {
     this.demoRequest=res;
     console.log(res);
     this.isLoading=false;
    });
  }
}
