import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditInvoicePageRoutingModule } from './edit-invoice-routing.module';

import { EditInvoicePage } from './edit-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditInvoicePageRoutingModule
  ],
  declarations: [EditInvoicePage],
  providers: [
    DatePipe
  ],
})
export class EditInvoicePageModule {}
