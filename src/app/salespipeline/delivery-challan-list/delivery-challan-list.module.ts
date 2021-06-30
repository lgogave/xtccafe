import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { DeliveryChallanListPageRoutingModule } from './delivery-challan-list-routing.module';

import { DeliveryChallanListPage } from './delivery-challan-list.page';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DeliveryChallanListPageRoutingModule
  ],
  providers: [
    DatePipe
  ],
  declarations: [DeliveryChallanListPage,InvoiceModalComponent],
  entryComponents:[InvoiceModalComponent]
})
export class DeliveryChallanListPageModule {}
