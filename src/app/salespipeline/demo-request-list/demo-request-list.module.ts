import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoRequestListPageRoutingModule } from './demo-request-list-routing.module';

import { DemoRequestListPage } from './demo-request-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoRequestListPageRoutingModule
  ],
  declarations: [DemoRequestListPage]
})
export class DemoRequestListPageModule {}
