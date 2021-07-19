import { Component, Input, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-dc-popup',
  templateUrl: './dc-popup.component.html',
  styleUrls: ['./dc-popup.component.scss'],
})
export class DcPopupComponent implements OnInit {
  @Input() salesId: string;
  @Input() locationId: string[];
  constructor(private navCtrl: NavController,public popoverCtrl: PopoverController) { }

  ngOnInit() {}
  createConsumable(){
    this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward(
      '/salespipeline/deliverychallan/' + this.salesId + '/' + this.locationId
    );
  }
  createInstallation(){
    this.popoverCtrl.dismiss();
  }

}
