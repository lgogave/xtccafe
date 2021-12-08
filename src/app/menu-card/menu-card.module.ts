import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuCardPageRoutingModule } from './menu-card-routing.module';
import { MenuCardPage } from './menu-card.page';
import { BrowserWebBluetooth, WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuCardPageRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: true // or false, this will enable logs in the browser's console
    })
  ],
  providers: [
    BrowserWebBluetooth
  ],
  declarations: [MenuCardPage],

})
export class MenuCardPageModule {}
