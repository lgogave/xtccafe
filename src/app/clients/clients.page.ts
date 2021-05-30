import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client } from './client.model';
import { ClientService } from './client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit, OnDestroy {
  loadedClients: Client[];
  filterloadedClients:Client[];
  isLoading = false;
  private clientSub: Subscription;
  private clientSub1: Subscription;
  private clientSub2: Subscription;
  @ViewChild('searchElement') searchElement;
  constructor(
    private clientService: ClientService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  ngOnInit() {
    //   this.clientService.getLocations().subscribe(location=>{
    // console.log(location);
    //  });
    this.clientSub = this.clientService.clients.subscribe((clients) => {
      this.loadedClients = clients;
      this.applyFilter('');
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.clientSub2 = this.clientService.fetchClients().subscribe(() => {
      this.isLoading = false;
    });
  }

  doRefresh(event) {
    this.clientSub1 = this.clientService.fetchClients().subscribe(() => {
      event.target.complete();
    });
  }
  search(event){
  const searchTerm = event.srcElement.value;
  this.applyFilter(searchTerm);
  }
  applyFilter(searchTerm:string){
  searchTerm=this.searchElement==undefined?'':this.searchElement.value;
  if (!searchTerm) {
    this.filterloadedClients=this.loadedClients;
    return;
  }
  this.filterloadedClients = this.loadedClients.filter(client => {
    if (client.name && searchTerm) {
      return (client.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || client.group?.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    }
  });
  }


  ngOnDestroy() {
    if (this.clientSub) {
      this.clientSub.unsubscribe();
    }
    if (this.clientSub1) {
      this.clientSub1.unsubscribe();
    }
    if (this.clientSub2) {
      this.clientSub2.unsubscribe();
    }
  }

  onDeleteClient(
    clientName: string,
    clientId: string,
    slidingEl: IonItemSliding
  ) {
    this.alertCtrl
      .create({
        header: 'Delete!',
        message:
          '<strong>Are you sure you want to delete the ' +
          clientName +
          '?</strong>',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              slidingEl.close();
            },
          },
          {
            text: 'Okay',
            handler: () => {
              slidingEl.close();
              this.loadingCtrl
                .create({ keyboardClose: true, message: 'Deleteing...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.clientService.deleteClient(clientId).subscribe(() => {
                    loadingEl.dismiss();
                  });
                });
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
