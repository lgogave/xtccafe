import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothService } from './bluetooth.service';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit, OnDestroy  {
  devices: any[] = [];
  showSpinner = false;
  isConnected = false;
  connChecked=false;
  messagelog='';
  message = '';
  messages = [];
  @ViewChild('connectElement') connectElement;
  @ViewChild('sendElement') sendElement;

  constructor(private toastCtrl: ToastController,
    private alertCtrl: AlertController,private plt: Platform,
    private bluetooth: BluetoothService) {
    if (this.plt.is('cordova')) {

    }
   }

   ngOnInit() {
    this.showSpinner = true;
    this.bluetooth.storedConnection().then((connected) => {
      this.isConnected = true;
      this.showSpinner = false;
      this.devices=[];
      this.devices.push(this.bluetooth.getstoredDevice());
    }, (fail) => {
      this.bluetooth.searchBluetooth().then((devices: Array<Object>) => {
        this.devices = devices;
        this.showSpinner = false;
      }, (error) => {
        this.presentToast(error);
        this.showSpinner = false;
      });
    });
  }

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }
  async sendMessage(message: string) {
    this.messagelog="wait...";
    this.sendElement.disabled=true;
    let data=await this.bluetooth.dataInOut(`${message}\n`);
    this.messagelog=data.toString();
    this.sendElement.disabled=false;



    // this.bluetooth.dataInOut(`${message}\n`).subscribe(data => {
    //   if (data !== 'BLUETOOTH.NOT_CONNECTED') {
    //     try {
    //       if (data) {
    //         const entry = JSON.parse(data);
    //         this.addLine(message);
    //       }
    //     } catch (error) {
    //       console.log(`[bluetooth-168]: ${JSON.stringify(error)}`);
    //     }
    //     // this.presentToast(data);
    //     this.message = '';
    //   } else {
    //     this.presentToast(data);
    //   }
    // });
  }
  addLine(message) {
    this.messages.push(message);
  }
  async presentToast(text: string) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    await toast.present();
  }
  ngOnDestroy() {
    this.disconnect();
  }

  refreshBluetooth(refresher) {
    if (refresher) {
      this.bluetooth.searchBluetooth().then((successMessage: Array<Object>) => {
        this.devices = [];
        this.devices = successMessage;
        refresher.target.complete();
      }, fail => {
        this.presentToast(fail);
        refresher.target.complete();
      });
    }
  }

  checkConnection(seleccion) {
    this.bluetooth.checkConnection().then(async (isConnected) => {
      const alert = await this.alertCtrl.create({
        header: 'BLUETOOTH.ALERTS.RECONNECT.TITLE',
        message: 'BLUETOOTH.ALERTS.RECONNECT.MESSAGE',
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'ACCEPT',
            handler: () => {
              this.disconnect().then(() => {
                this.bluetooth.deviceConnection(seleccion).then(success => {
                  this.isConnected = true;
                  this.presentToast(success);
                }, fail => {
                  this.isConnected = false;
                  this.presentToast(fail);
                });
              });
            }
          }
        ]
      });
      await alert.present();
    }, async (notConnected) => {
      const alert = await this.alertCtrl.create({
        header: 'BLUETOOTH.ALERTS.CONNECT.TITLE',
        message: 'BLUETOOTH.ALERTS.CONNECT.MESSAGE',
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'ACCEPT',
            handler: () => {
              this.bluetooth.deviceConnection(seleccion).then(success => {
                this.isConnected = true;
                this.connectElement.checked=false;
                this.presentToast(success);
              }, fail => {
                this.isConnected = false;
                this.connectElement.checked=true;
                this.presentToast(fail);
              });
            }
          }
        ]
      });
      await alert.present();
    });
  }


}
