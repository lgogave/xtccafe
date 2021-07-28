import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentalInvoicesPage } from './rental-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: RentalInvoicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalInvoicesPageRoutingModule {}
