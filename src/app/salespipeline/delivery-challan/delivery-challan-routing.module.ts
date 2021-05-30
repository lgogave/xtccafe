import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryChallanPage } from './delivery-challan.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryChallanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryChallanPageRoutingModule {}
