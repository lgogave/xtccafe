import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  BLUETOOTH_ID = 'bluetoothId';
  private _connectedDevice:any;
  constructor() { }
     getBluetoothId(): any {
     return this._connectedDevice;
    }
    setBluetoothId(device:any) {
       this._connectedDevice=device;
       return true;
    }
}

