import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockregisterlistPageRoutingModule } from './stockregisterlist-routing.module';

import { StockregisterlistPage } from './stockregisterlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockregisterlistPageRoutingModule
  ],
  declarations: [StockregisterlistPage]
})
export class StockregisterlistPageModule {}
