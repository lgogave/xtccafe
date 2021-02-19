import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client } from './client.model';
import { ClientService } from './client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit,OnDestroy {

  loadedClients:Client[];
  isLoading=false;
  private clientSub:Subscription;

  constructor(private clientService:ClientService,private loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.clientSub = this.clientService.clients.subscribe((clients) => {
      this.loadedClients = clients;
    });

  }
  ionViewWillEnter(){
    this.isLoading=true;
    this.clientService.fetchClients().subscribe(() => {
      this.isLoading = false;
    });
  }

  doRefresh(event) {
    this.clientService.fetchClients().subscribe(() => {
      event.target.complete();
    });
  }

  ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }
  }

  onDeleteClient(clientId:string,slidingEl:IonItemSliding){
    slidingEl.close();
    this.loadingCtrl.create({ keyboardClose: true,message:'Deleteing...' }).then((loadingEl) => {
      loadingEl.present();
    this.clientService.deleteClient(clientId).subscribe(()=>{
      loadingEl.dismiss();
    });
  });
  }

}
