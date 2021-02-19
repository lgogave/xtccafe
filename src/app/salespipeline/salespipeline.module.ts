import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalespipelinePageRoutingModule } from './salespipeline-routing.module';

import { SalespipelinePage } from './salespipeline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalespipelinePageRoutingModule
  ],
  declarations: [SalespipelinePage]
})
export class SalespipelinePageModule {}
