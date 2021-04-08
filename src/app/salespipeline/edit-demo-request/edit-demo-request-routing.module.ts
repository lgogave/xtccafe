import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDemoRequestPage } from './edit-demo-request.page';

const routes: Routes = [
  {
    path: '',
    component: EditDemoRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDemoRequestPageRoutingModule {}
