import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoRequestPage } from './demo-request.page';

const routes: Routes = [
  {
    path: '',
    component: DemoRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRequestPageRoutingModule {}
