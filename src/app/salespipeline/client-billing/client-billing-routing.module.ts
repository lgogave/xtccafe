import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientBillingPage } from './client-billing.page';

const routes: Routes = [
  {
    path: '',
    component: ClientBillingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientBillingPageRoutingModule {}
