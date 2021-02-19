import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSalesPage } from './add-sales.page';

const routes: Routes = [
  {
    path: '',
    component: AddSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSalesPageRoutingModule {}
