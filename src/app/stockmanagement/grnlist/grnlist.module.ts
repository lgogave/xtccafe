import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrnlistPageRoutingModule } from './grnlist-routing.module';

import { GrnlistPage } from './grnlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrnlistPageRoutingModule
  ],
  declarations: [GrnlistPage]
})
export class GrnlistPageModule {}
