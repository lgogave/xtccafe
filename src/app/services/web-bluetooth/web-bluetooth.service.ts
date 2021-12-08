import { Injectable } from '@angular/core';
import { BluetoothCore,BrowserWebBluetooth } from '@manekinekko/angular-web-bluetooth';
import { map, mergeMap } from 'rxjs/operators';
import { WebBluetoothDevice } from 'src/app/models/web-bluetooth.model';

@Injectable({
  providedIn: 'root'
})
export class WebBluetoothService {
   GATT_CHARACTERISTIC_BATTERY_LEVEL = '0000ffe1-0000-1000-8000-00805f9b34fb';
   GATT_PRIMARY_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
   _characteristic:BluetoothRemoteGATTCharacteristic=null;
  constructor(public ble: BluetoothCore) {}

  getDevice() {
    // call this method to get the connected device
    return this.ble.getDevice$();
  }

  stream() {
    // call this method to get a stream of values emitted by the device
    return this.ble.streamValues$().pipe(map((value: DataView) => value.getUint8(0)));
  }

  disconnectDevice() {
    this._characteristic=null;
    this.ble.disconnectDevice();
  }

  /**
   * Get Battery Level GATT Characteristic value.
   * This logic is specific to this service, this is why we can't abstract it elsewhere.
   * The developer is free to provide any service, and characteristics they want.
   *
   * @return Emites the value of the requested service read from the device
   */
  updatevalue() {
    console.log('Getting Battery level...');
    return this.ble
        // 1) call the discover method will trigger the discovery process (by the browser)
        .discover$({

          filters: [{
            services: ['0000ffe0-0000-1000-8000-00805f9b34fb'],
        }],
        }).toPromise()
        .then(res=>{
          let gatt=res as BluetoothRemoteGATTServer;
          return gatt;
        })
        .then(gatt=>{
          return this.ble.getPrimaryService$(gatt,this.GATT_PRIMARY_SERVICE).toPromise().then(res=>{
            let primaryService=res as BluetoothRemoteGATTService;
            return primaryService;
          })
          .then(primaryService=>{
            return this.ble.getCharacteristic$(primaryService,this.GATT_CHARACTERISTIC_BATTERY_LEVEL as BluetoothCharacteristicUUID).toPromise().then(res=>{
              let characteristic=res as BluetoothRemoteGATTCharacteristic;
              return characteristic;
            })
            .then(characteristic=>{
              let encoder = new TextEncoder();
              let value = 'A#1007';
              return this.ble.writeValue$(characteristic,encoder.encode(value)).toPromise().then(res=>{
                return res;
              });
              });
        });

        /*
        .pipe(
          // 2) get that service
          mergeMap((gatt: BluetoothRemoteGATTServer) => {
            return this.ble.getPrimaryService$(gatt,this.GATT_PRIMARY_SERVICE);
          }),
          // 3) get a specific characteristic on that service
          mergeMap((primaryService: BluetoothRemoteGATTService) => {
            return this.ble.getCharacteristic$(primaryService, this.GATT_CHARACTERISTIC_BATTERY_LEVEL);
          }),

          // 4) ask for the value of that characteristic (will return a DataView)
          mergeMap((characteristic: BluetoothRemoteGATTCharacteristic) => {
            return this.ble.readValue$(characteristic);
          }),
          // 5) on that DataView, get the right value
          map((value: DataView) => value.getUint8(0))
        )
        */
  });
  }

async discoverbledevice() {
await this.ble
  // 1) call the discover method will trigger the discovery process (by the browser)
  .discover$({
    filters: [{
      services: ['0000ffe0-0000-1000-8000-00805f9b34fb'],
  }],
  }).toPromise()
  .then(res=>{
    let gatt=res as BluetoothRemoteGATTServer;
    return gatt;
  })
  .then(gatt=>{
    return this.ble.getPrimaryService$(gatt,this.GATT_PRIMARY_SERVICE).toPromise().then(res=>{
      let primaryService=res as BluetoothRemoteGATTService;
      return primaryService;
    })
    .then(primaryService=>{
      return this.ble.getCharacteristic$(primaryService,this.GATT_CHARACTERISTIC_BATTERY_LEVEL as BluetoothCharacteristicUUID).toPromise().then(res=>{
        let characteristic=res as BluetoothRemoteGATTCharacteristic;
        this._characteristic=characteristic;
        return characteristic;
      })
      });
  });
}

async writeValue(strvalue:string) {

  let encoder = new TextEncoder();
  let value = strvalue;
  return this.ble.writeValue$(this._characteristic,encoder.encode(value)).toPromise().then(res=>{
    console.log(res);
    return res;
  });
}
 ispaired(){
   if(this._characteristic){
     return true;
   }
   return false;
 }


}

