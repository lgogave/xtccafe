import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockbreakupPageRoutingModule } from './stockbreakup-routing.module';

import { StockbreakupPage } from './stockbreakup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockbreakupPageRoutingModule
  ],
  declarations: [StockbreakupPage]
})
export class StockbreakupPageModule {}
