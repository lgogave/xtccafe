import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { DemoRequestViewModel } from 'src/app/models/demo-request.model';
import { DemoRequestService } from 'src/app/services/demo-request.service';

@Component({
  selector: 'app-demo-request-list',
  templateUrl: './demo-request-list.page.html',
  styleUrls: ['./demo-request-list.page.scss'],
})
export class DemoRequestListPage implements OnInit,OnDestroy {
  private demoRequestsSub: Subscription;
  demoRequests: DemoRequestViewModel[];
  isLoading = false;
  constructor(private demoRequestService:DemoRequestService) {
  }
  ngOnInit() {
    this.demoRequestsSub=this.demoRequestService.demoRequests.subscribe((requests) => {
      this.demoRequests=requests;
    });
  }

  ionViewWillEnter() {
    this.isLoading=true;
    this.demoRequestService.fetchDemoRequest().subscribe(res=>{
      console.log(this.demoRequests);
      this.isLoading=false;
    })
  }
  doRefresh(){
    this.isLoading=true;
    this.demoRequestService.fetchDemoRequest().subscribe(res=>{
      this.isLoading=false;
    })
  }

  ngOnDestroy() {
    if (this.demoRequestsSub) {
      this.demoRequestsSub.unsubscribe();
    }
  }
}
