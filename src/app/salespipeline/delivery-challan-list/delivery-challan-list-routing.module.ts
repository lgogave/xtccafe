import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryChallanListPage } from './delivery-challan-list.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryChallanListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryChallanListPageRoutingModule {}
