import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsPage } from './clients.page';

const routes: Routes = [
  {
    path: '',
    component: ClientsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-client/add-client.module').then( m => m.AddClientPageModule)
  },
  {
    path: 'edit/:clientId',
    loadChildren: () => import('./edit-client/edit-client.module').then( m => m.EditClientPageModule)
  },
  {
    path: 'detail/:clientId',
    loadChildren: () => import('./detail-client/detail-client.module').then( m => m.DetailClientPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsPageRoutingModule {}
