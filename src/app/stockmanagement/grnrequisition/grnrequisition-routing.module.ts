import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrnrequisitionPage } from './grnrequisition.page';

const routes: Routes = [
  {
    path: '',
    component: GrnrequisitionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrnrequisitionPageRoutingModule {}
