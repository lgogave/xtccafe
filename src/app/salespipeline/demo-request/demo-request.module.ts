import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoRequestPageRoutingModule } from './demo-request-routing.module';

import { DemoRequestPage } from './demo-request.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    DemoRequestPageRoutingModule
  ],
  declarations: [DemoRequestPage]
})
export class DemoRequestPageModule {}
