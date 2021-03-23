import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditClientAccessPageRoutingModule } from './edit-client-access-routing.module';

import { EditClientAccessPage } from './edit-client-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditClientAccessPageRoutingModule
  ],
  declarations: [EditClientAccessPage]
})
export class EditClientAccessPageModule {}
