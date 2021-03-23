import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientAccessPage } from './client-access.page';

const routes: Routes = [
  {
    path: '',
    component: ClientAccessPage
  },
  {
    path: 'add-client-access',
    loadChildren: () => import('./add-client-access/add-client-access.module').then( m => m.AddClientAccessPageModule)
  },
  {
    path: 'edit-client-access',
    loadChildren: () => import('./edit-client-access/edit-client-access.module').then( m => m.EditClientAccessPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientAccessPageRoutingModule {}
