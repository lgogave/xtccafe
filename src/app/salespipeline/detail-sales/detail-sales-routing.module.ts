import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSalesPage } from './detail-sales.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSalesPageRoutingModule {}
