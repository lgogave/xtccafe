import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { SalespipelinePage } from './salespipeline.page';

const routes: Routes = [
  {
    path: '',
    component: SalespipelinePage,
  },
  {
    path: 'new',
    loadChildren: () =>
      import('./add-sales/add-sales.module').then((m) => m.AddSalesPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'detail/:salesId',
    loadChildren: () =>
      import('./detail-sales/detail-sales.module').then(
        (m) => m.DetailSalesPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'edit/:salesId',
    loadChildren: () =>
      import('./edit-sales/edit-sales.module').then(
        (m) => m.EditSalesPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'comments/:salesId/:client',
    loadChildren: () =>
      import('./comments-sales/comments-sales.module').then(
        (m) => m.CommentsSalesPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'demorequest/:salesId/:locationIndex',
    loadChildren: () =>
      import('./demo-request/demo-request.module').then(
        (m) => m.DemoRequestPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'demorequests',
    loadChildren: () =>
      import('./demo-request-list/demo-request-list.module').then(
        (m) => m.DemoRequestListPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'demodetail/:demoId',
    loadChildren: () =>
      import('./demo-request-detail/demo-request-detail.module').then(
        (m) => m.DemoRequestDetailPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'editdemorequest/:demoId',
    loadChildren: () =>
      import('./edit-demo-request/edit-demo-request.module').then(
        (m) => m.EditDemoRequestPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'clientbilling/:salesId/:locId',
    loadChildren: () =>
      import('./client-billing/client-billing.module').then(
        (m) => m.ClientBillingPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'deliverychallan/:salesId/:locId',
    loadChildren: () =>
      import('./delivery-challan/delivery-challan.module').then(
        (m) => m.DeliveryChallanPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'deliverychallan/:salesId/:locId/:dcId',
    loadChildren: () =>
      import('./delivery-challan/delivery-challan.module').then(
        (m) => m.DeliveryChallanPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'deliverychallanlist/:clientId',
    loadChildren: () =>
      import('./delivery-challan-list/delivery-challan-list.module').then(
        (m) => m.DeliveryChallanListPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'deliverychallanlist',
    loadChildren: () =>
      import('./delivery-challan-list/delivery-challan-list.module').then(
        (m) => m.DeliveryChallanListPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'invoicelist/:locId',
    loadChildren: () =>
      import('./invoice-list/invoice-list.module').then(
        (m) => m.InvoiceListPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'invoicelist',
    loadChildren: () =>
      import('./invoice-list/invoice-list.module').then(
        (m) => m.InvoiceListPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'editinvoice/:invId',
    loadChildren: () => import('./edit-invoice/edit-invoice.module').then( m => m.EditInvoicePageModule),
    canLoad: [AuthGuard],

  },
  {
    path: 'dcinstallation/:salesId/:locId',
    loadChildren: () => import('./dc-installation/dc-installation.module').then( m => m.DcInstallationPageModule)
  },
  {
    path: 'dcinstallation/:salesId/:locId/:dcId',
    loadChildren: () => import('./dc-installation/dc-installation.module').then( m => m.DcInstallationPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalespipelinePageRoutingModule {}
