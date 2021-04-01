import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoRequestDetailPageRoutingModule } from './demo-request-detail-routing.module';

import { DemoRequestDetailPage } from './demo-request-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoRequestDetailPageRoutingModule
  ],
  declarations: [DemoRequestDetailPage]
})
export class DemoRequestDetailPageModule {}
