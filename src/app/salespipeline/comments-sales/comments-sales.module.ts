import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentsSalesPageRoutingModule } from './comments-sales-routing.module';

import { CommentsSalesPage } from './comments-sales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentsSalesPageRoutingModule
  ],
  declarations: [CommentsSalesPage]
})
export class CommentsSalesPageModule {}
