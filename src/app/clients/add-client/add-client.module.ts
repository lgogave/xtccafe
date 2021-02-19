import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddClientPageRoutingModule } from './add-client-routing.module';

import { AddClientPage } from './add-client.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    AddClientPageRoutingModule
  ],
  declarations: [AddClientPage]
})
export class AddClientPageModule {}
