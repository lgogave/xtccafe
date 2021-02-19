import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSalesPageRoutingModule } from './detail-sales-routing.module';

import { DetailSalesPage } from './detail-sales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSalesPageRoutingModule
  ],
  declarations: [DetailSalesPage]
})
export class DetailSalesPageModule {}
