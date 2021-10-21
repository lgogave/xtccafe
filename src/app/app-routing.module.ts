import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad:[AuthGuard]
  },

  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then( m => m.ClientsPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'salespipeline',
    loadChildren: () => import('./salespipeline/salespipeline.module').then( m => m.SalespipelinePageModule),
    canLoad:[AuthGuard]
  },
  // {
  //   path: 'settings',
  //   loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
  //   canLoad:[AuthGuard]
  // },
  {
    path: 'settings',
    loadChildren: () => import('./settings/client-access/client-access.module').then( m => m.ClientAccessPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule),
    canLoad:[AuthGuard]
  },
  {
    path: 'notificationdetail/:id',
    loadChildren: () => import('./notification-detail/notification-detail.module').then( m => m.NotificationDetailPageModule)
  },
  {
    path: 'devices/bluetooth',
    loadChildren: () => import('./devices/bluetooth/bluetooth.module').then( m => m.BluetoothPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
