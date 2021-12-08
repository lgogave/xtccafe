import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PorequsitionlistPageRoutingModule } from './porequsitionlist-routing.module';

import { PorequsitionlistPage } from './porequsitionlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PorequsitionlistPageRoutingModule
  ],
  declarations: [PorequsitionlistPage]
})
export class PorequsitionlistPageModule {}
