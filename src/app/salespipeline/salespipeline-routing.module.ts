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
  },
  {
    path: 'demorequests',
    loadChildren: () => import('./demo-request-list/demo-request-list.module').then( m => m.DemoRequestListPageModule)
  },
  {
    path: 'demodetail/:demoId',
    loadChildren: () => import('./demo-request-detail/demo-request-detail.module').then( m => m.DemoRequestDetailPageModule)
  },
  {
    path: 'editdemorequest/:demoId',
    loadChildren: () => import('./edit-demo-request/edit-demo-request.module').then( m => m.EditDemoRequestPageModule)
  },
  {
    path: 'clientbilling/:salesId/:locId',
    loadChildren: () => import('./client-billing/client-billing.module').then( m => m.ClientBillingPageModule)
  },
  {
    path: 'deliverychallan/:salesId/:locId',
    loadChildren: () => import('./delivery-challan/delivery-challan.module').then( m => m.DeliveryChallanPageModule)
  },
  {
    path: 'deliverychallan/:salesId/:locId/:dcId',
    loadChildren: () => import('./delivery-challan/delivery-challan.module').then( m => m.DeliveryChallanPageModule)
  },
  {
    path: 'deliverychallanlist/:clientId',
    loadChildren: () => import('./delivery-challan-list/delivery-challan-list.module').then( m => m.DeliveryChallanListPageModule)
  },
  {
    path: 'deliverychallanlist/',
    loadChildren: () => import('./delivery-challan-list/delivery-challan-list.module').then( m => m.DeliveryChallanListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalespipelinePageRoutingModule {}
