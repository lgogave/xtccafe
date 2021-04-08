import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDemoRequestPageRoutingModule } from './edit-demo-request-routing.module';

import { EditDemoRequestPage } from './edit-demo-request.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditDemoRequestPageRoutingModule
  ],
  declarations: [EditDemoRequestPage]
})
export class EditDemoRequestPageModule {}
