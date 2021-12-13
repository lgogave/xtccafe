import { Component, OnInit } from '@angular/core';
import { BranchStockRegister, StockRegister } from '../stockregister/stockregister.model';
import { StockRegisterService } from '../stockregister/stockregister.service';

@Component({
  selector: 'app-stockregisterlist',
  templateUrl: './stockregisterlist.page.html',
  styleUrls: ['./stockregisterlist.page.scss'],
})
export class StockregisterlistPage implements OnInit {
  stockEntries: StockRegister[];
  branchStock:BranchStockRegister[];
  isLoading = false;
  constructor(
    private stockService:StockRegisterService,
  ) {
  }

  ngOnInit() {
    this.doRefresh(null);
  }
  ionViewWillEnter() {
    this.doRefresh(null);
  }

  async doRefresh(event) {
    this.isLoading = true;
    this.stockEntries = await this.stockService.getAll();
    this.branchStock=this.stockService.getByBranch(this.stockEntries);
    this.isLoading = false;
    if (event != null) {
      event.target.complete();
    }
  }




}
