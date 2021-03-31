import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalespipelinePage } from './salespipeline.page';

const routes: Routes = [
  {
    path: '',
    component: SalespipelinePage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-sales/add-sales.module').then( m => m.AddSalesPageModule)
  },
  {
    path: 'detail/:salesId',
    loadChildren: () => import('./detail-sales/detail-sales.module').then( m => m.DetailSalesPageModule)
  },
  {
    path: 'edit/:salesId',
    loadChildren: () => import('./edit-sales/edit-sales.module').then( m => m.EditSalesPageModule)
  },
  {
    path: 'comments/:salesId/:client',
    loadChildren: () => import('./comments-sales/comments-sales.module').then( m => m.CommentsSalesPageModule)
  },
  {
    path: 'demorequest/:salesId/:locationIndex',
    loadChildren: () => import('./demo-request/demo-request.module').then( m => m.DemoRequestPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalespipelinePageRoutingModule {}
