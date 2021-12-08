import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrnrequisitionPageRoutingModule } from './grnrequisition-routing.module';

import { GrnrequisitionPage } from './grnrequisition.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    GrnrequisitionPageRoutingModule
  ],
  declarations: [GrnrequisitionPage]
})
export class GrnrequisitionPageModule {}
