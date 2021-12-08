import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrnlistPage } from './grnlist.page';

const routes: Routes = [
  {
    path: '',
    component: GrnlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrnlistPageRoutingModule {}
