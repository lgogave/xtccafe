import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientBillingPageRoutingModule } from './client-billing-routing.module';

import { ClientBillingPage } from './client-billing.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ClientBillingPageRoutingModule
  ],
  declarations: [ClientBillingPage]
})
export class ClientBillingPageModule {}
