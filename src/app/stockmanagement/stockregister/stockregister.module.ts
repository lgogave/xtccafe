import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockregisterPageRoutingModule } from './stockregister-routing.module';

import { StockregisterPage } from './stockregister.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockregisterPageRoutingModule
  ],
  declarations: [StockregisterPage]
})
export class StockregisterPageModule {}
