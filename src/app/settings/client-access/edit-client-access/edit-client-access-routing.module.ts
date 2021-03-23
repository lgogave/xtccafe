import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditClientAccessPage } from './edit-client-access.page';

const routes: Routes = [
  {
    path: '',
    component: EditClientAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditClientAccessPageRoutingModule {}
