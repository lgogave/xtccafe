import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryChallanPageRoutingModule } from './delivery-challan-routing.module';

import { DeliveryChallanPage } from './delivery-challan.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    DeliveryChallanPageRoutingModule
  ],
  declarations: [DeliveryChallanPage]
})
export class DeliveryChallanPageModule {}
