import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientSales, ClientSalesPipeline } from './salespipeline.model';
import { SalespipelineService } from './salespipeline.service';

@Component({
  selector: 'app-salespipeline',
  templateUrl: './salespipeline.page.html',
  styleUrls: ['./salespipeline.page.scss'],
})
export class SalespipelinePage implements OnInit, OnDestroy {
  loadedClientSales: ClientSales[];
  isLoading = false;
  searchTerm: string = '';
  private salespipelineSub: Subscription;

  constructor(
    private salespipelineService: SalespipelineService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.salespipelineSub =this.salespipelineService.clientSales.subscribe((clientSales) => {
    this.loadedClientSales=clientSales;

    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.salespipelineService.fetchClientAndSaplesPipeline().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.salespipelineSub) {
      this.salespipelineSub.unsubscribe();
    }
  }

  onDeleteSalespipeline(id: string,clientId:string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Deleteing...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.salespipelineService.deleteClientSalesPipeline(id).subscribe(() => {
          //this.filterClient();
        });
        this.salespipelineService.deleteSalesPipeline(clientId).subscribe(() => {
          this.filterClient();
          loadingEl.dismiss();
        });

      });
  }
  doRefresh(event) {
    this.salespipelineService.fetchClientAndSaplesPipeline().subscribe(() => {
      event.target.complete();
    });
  }

  filterClient() {
    // item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    // this.listSalespipeline = this.loadedSalespipeline.filter((sales) => {
    //  return sales.client.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    // });
  }
  convertTimestampToDate(date:any){
    let isodate= this.salespipelineService.convertTimeStampToDate(date);
    var dd = String(isodate.getDate()).padStart(2, '0');
    var mm = String(isodate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = isodate.getFullYear();
    return  dd + '/' + mm  + '/' + yyyy;
   }
}
