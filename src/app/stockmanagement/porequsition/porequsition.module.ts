import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PorequsitionPageRoutingModule } from './porequsition-routing.module';

import { PorequsitionPage } from './porequsition.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PorequsitionPageRoutingModule
  ],
  declarations: [PorequsitionPage]
})
export class PorequsitionPageModule {}
