import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuCardPage } from './menu-card.page';

const routes: Routes = [
  {
    path: '',
    component: MenuCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuCardPageRoutingModule {}
