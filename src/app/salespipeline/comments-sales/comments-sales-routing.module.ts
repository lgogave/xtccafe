import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommentsSalesPage } from './comments-sales.page';

const routes: Routes = [
  {
    path: '',
    component: CommentsSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentsSalesPageRoutingModule {}
