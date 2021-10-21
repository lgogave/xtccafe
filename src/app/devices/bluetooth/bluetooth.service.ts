import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Observable, Subscription, from } from 'rxjs';
import { first, mergeMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private connection: Subscription;
  private connectionCommunication: Subscription;
  private reader: Observable<any>;
  constructor(private bluetoothSerial: BluetoothSerial, private storage: StorageService) { }
  searchBluetooth(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(success => {
        this.bluetoothSerial.discoverUnpaired().then(response => {
          if (response.length > 0) {
            resolve(response);
          } else {
            reject('BLUETOOTH.NOT_DEVICES_FOUND');
          }
        }).catch((error) => {
          console.log(`[bluetooth.service-41] Error: ${JSON.stringify(error)}`);
          reject('BLUETOOTH.NOT_AVAILABLE_IN_THIS_DEVICE');
        });
      }, fail => {
        console.log(`[bluetooth.service-45] Error: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH.NOT_AVAILABLE');
      });
    });
  }
  checkConnection() {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        resolve('BLUETOOTH.CONNECTED');
      }, notConnected => {
        reject('BLUETOOTH.NOT_CONNECTED');
      });
    });
  }

  deviceConnection(device:any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.connection = this.bluetoothSerial.connect(device.id).subscribe(() => {
        let res=this.storage.setBluetoothId(device);
        resolve('BLUETOOTH.CONNECTED');
      }, fail => {
        console.log(`[bluetooth.service-88] Error conexión: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH.CANNOT_CONNECT');
      });
    });
  }

  disconnect(): Promise<boolean> {
    return new Promise((result) => {
      if (this.connectionCommunication) {
        this.connectionCommunication.unsubscribe();
      }
      if (this.connection) {
        this.connection.unsubscribe();
      }
      result(true);
    });
  }

  async dataInOut(message: string): Promise<any> {
    return  this.bluetoothSerial.isConnected().then(async (isConnected) => {
      return await this.bluetoothSerial.write(message).then(async (success) => {
        return await this.bluetoothSerial.read().then((data) => {
          return data;
        });
      });
    }, notConected => {
      return 'Blutooth Not connect'
    })
  }

  dataInOut_(message: string): Observable<any> {
    return Observable.create(observer => {
      this.bluetoothSerial.isConnected().then((isConnected) => {
        this.reader = from(this.bluetoothSerial.write(message)).pipe(mergeMap(() => {
            return this.bluetoothSerial.subscribeRawData();
          })).pipe(mergeMap(() => {
            return this.bluetoothSerial.readUntil('\n');   // <= delimitador
          }));
        this.reader.subscribe(data => {
          observer.next(data);
        });
      }, notConected => {
        observer.next('BLUETOOTH.NOT_CONNECTED');
        observer.complete();
      });
    });
  }
  storedConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
        let device=this.storage.getBluetoothId();
        this.deviceConnection(device).then(success => {
          resolve(success);
        }, fail => {
          reject(fail);
        });
    });
  }
  getstoredDevice(): Promise<any> {
    return this.storage.getBluetoothId();
  }

}
