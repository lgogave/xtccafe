import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BluetoothPageRoutingModule } from './bluetooth-routing.module';

import { BluetoothPage } from './bluetooth.page';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothService } from './bluetooth.service';
import { StorageService } from './storage.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BluetoothPageRoutingModule
  ],
  providers: [
    BluetoothSerial,
    BluetoothService,
    StorageService

  ],
  declarations: [BluetoothPage]
})
export class BluetoothPageModule {}
