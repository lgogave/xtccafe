import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockbreakupPage } from './stockbreakup.page';

const routes: Routes = [
  {
    path: '',
    component: StockbreakupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockbreakupPageRoutingModule {}
