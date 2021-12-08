import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockregisterPage } from './stockregister.page';

const routes: Routes = [
  {
    path: '',
    component: StockregisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockregisterPageRoutingModule {}
