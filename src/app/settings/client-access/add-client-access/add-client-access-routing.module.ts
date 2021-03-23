import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddClientAccessPage } from './add-client-access.page';

const routes: Routes = [
  {
    path: '',
    component: AddClientAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddClientAccessPageRoutingModule {}
