import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Salespipeline } from './salespipeline.model';
import { SalespipelineService } from './salespipeline.service';

@Component({
  selector: 'app-salespipeline',
  templateUrl: './salespipeline.page.html',
  styleUrls: ['./salespipeline.page.scss'],
})
export class SalespipelinePage implements OnInit, OnDestroy {
  listSalespipeline: Salespipeline[];
  loadedSalespipeline: Salespipeline[];
  isLoading = false;
  searchTerm: string = '';
  private SalespipelineSub: Subscription;

  constructor(
    private SalespipelineService: SalespipelineService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.SalespipelineSub = this.SalespipelineService.salespipeline.subscribe(
      (salespipelines) => {
        this.loadedSalespipeline = salespipelines;
        this.listSalespipeline = salespipelines;
      }
    );
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.SalespipelineService.fetchSalespipeline().subscribe(() => {
      this.filterClient();
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.SalespipelineSub) {
      this.SalespipelineSub.unsubscribe();
    }
  }

  onDeleteSalespipeline(SalespipelineId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Deleteing...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.SalespipelineService.deleteSalespipeline(
          SalespipelineId
        ).subscribe(() => {
          this.filterClient();
          loadingEl.dismiss();
        });
      });
  }
  doRefresh(event) {
    this.SalespipelineService.fetchSalespipeline().subscribe(() => {
      this.filterClient();
      event.target.complete();
    });
  }

  filterClient() {
    // item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    this.listSalespipeline = this.loadedSalespipeline.filter((sales) => {
     return sales.client.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
}
