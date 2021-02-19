import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSalesPage } from './edit-sales.page';

const routes: Routes = [
  {
    path: '',
    component: EditSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSalesPageRoutingModule {}
