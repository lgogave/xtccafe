import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientAccessPageRoutingModule } from './client-access-routing.module';

import { ClientAccessPage } from './client-access.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ClientAccessPageRoutingModule
  ],
  declarations: [ClientAccessPage]
})
export class ClientAccessPageModule {}
