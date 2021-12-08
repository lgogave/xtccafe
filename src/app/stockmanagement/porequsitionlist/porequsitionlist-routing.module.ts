import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PorequsitionlistPage } from './porequsitionlist.page';

const routes: Routes = [
  {
    path: '',
    component: PorequsitionlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PorequsitionlistPageRoutingModule {}
