import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddClientAccessPageRoutingModule } from './add-client-access-routing.module';

import { AddClientAccessPage } from './add-client-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddClientAccessPageRoutingModule
  ],
  declarations: [AddClientAccessPage]
})
export class AddClientAccessPageModule {}
