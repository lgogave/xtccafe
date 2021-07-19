import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DcInstallationPageRoutingModule } from './dc-installation-routing.module';

import { DcInstallationPage } from './dc-installation.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    DcInstallationPageRoutingModule
  ],
  declarations: [DcInstallationPage]
})
export class DcInstallationPageModule {}
