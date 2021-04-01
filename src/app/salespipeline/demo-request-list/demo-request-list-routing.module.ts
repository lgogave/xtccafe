import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoRequestListPage } from './demo-request-list.page';

const routes: Routes = [
  {
    path: '',
    component: DemoRequestListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRequestListPageRoutingModule {}
