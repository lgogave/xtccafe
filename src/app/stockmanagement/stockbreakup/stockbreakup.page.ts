import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockRegister } from '../stockregister/stockregister.model';
import { StockRegisterService } from '../stockregister/stockregister.service';

@Component({
  selector: 'app-stockbreakup',
  templateUrl: './stockbreakup.page.html',
  styleUrls: ['./stockbreakup.page.scss'],
})
export class StockbreakupPage implements OnInit {
  isLoading:boolean=false;
  stockEntries: StockRegister[];
  branch:string;
  constructor(
    private route: ActivatedRoute,
    private stockService:StockRegisterService
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      if(paramMap.has('branch')){
        this.branch = paramMap.get('branch');
       }

    });
  }

  ionViewWillEnter() {
    if(this.branch)
    this.doRefresh(null);
  }

  async doRefresh(event) {
    this.isLoading = true;
    this.stockEntries = await this.stockService.getStockBrekupByBranch(this.branch);
    console.log(this.stockEntries);
    this.isLoading = false;
    if (event != null) {
      event.target.complete();
    }
  }
}
