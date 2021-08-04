import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentalInvoicesPageRoutingModule } from './rental-invoices-routing.module';

import { RentalInvoicesPage } from './rental-invoices.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,FormsModule,
    IonicModule,
    RentalInvoicesPageRoutingModule
  ],
  providers: [
    DatePipe
  ],
  declarations: [RentalInvoicesPage]
})
export class RentalInvoicesPageModule {}
