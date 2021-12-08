import { BluetoothCore } from "@manekinekko/angular-web-bluetooth";

export class WebBluetoothDevice{
  constructor(
    public ble:BluetoothCore,
    public gatt:BluetoothRemoteGATTServer,
    public primaryService:BluetoothRemoteGATTService,
    public characteristic:BluetoothRemoteGATTCharacteristic
  ){}
}
