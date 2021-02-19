import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailClientPage } from './detail-client.page';

const routes: Routes = [
  {
    path: '',
    component: DetailClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailClientPageRoutingModule {}
