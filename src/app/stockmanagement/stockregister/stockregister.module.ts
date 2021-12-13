import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockregisterPageRoutingModule } from './stockregister-routing.module';

import { StockregisterPage } from './stockregister.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    StockregisterPageRoutingModule
  ],
  declarations: [StockregisterPage]
})
export class StockregisterPageModule {}
