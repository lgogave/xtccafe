import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DcInstallationPage } from './dc-installation.page';

const routes: Routes = [
  {
    path: '',
    component: DcInstallationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DcInstallationPageRoutingModule {}
