import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { EditClientPageRoutingModule } from './edit-client-routing.module';

import { EditClientPage } from './edit-client.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditClientPageRoutingModule
  ],
  declarations: [EditClientPage]
})
export class EditClientPageModule {}
