import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AlertController, IonItemSliding, IonSegment, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { ClientSales, ClientSalesPipeline } from './salespipeline.model';
import { SalespipelineService } from './salespipeline.service';
import {Platform} from '@ionic/angular'
import { File } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ReportService } from '../services/report.service';
@Component({
  selector: 'app-salespipeline',
  templateUrl: './salespipeline.page.html',
  styleUrls: ['./salespipeline.page.scss'],
})

export class SalespipelinePage implements OnInit, OnDestroy {
  loadedClientSales: ClientSales[];
  relevantClientSales: ClientSales[];
  isLoading = false;
  searchTerm: string = '';
  segmentValue:string='0';
  private salespipelineSub: Subscription;
  @ViewChild('segmentButton', { static: false }) segmentButton: IonSegment;
  @ViewChild('searchElement') searchElement;
  constructor(
    private salespipelineService: SalespipelineService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userService:UserService,
    private reportService:ReportService,
    private toastController: ToastController,
    private plt: Platform,
    private file: File,
  ) {}

  ngOnInit() {
    this.salespipelineSub =this.salespipelineService.clientSales.subscribe((clientSales) => {
    this.loadedClientSales=clientSales;
    this.relevantClientSales=this.applyFilter("0");
    });
  }
  ionViewWillEnter() {
    this.segmentButton.value="0";
    this.isLoading = true;
    this.salespipelineService.fetchClientAndSaplesPipeline().subscribe(() => {
      this.isLoading = false;
    });

  }

  ngOnDestroy() {
    if (this.salespipelineSub) {
      this.salespipelineSub.unsubscribe();
    }
  }
  onDeleteSalespipeline(id: string,clientId:string, slidingEl: IonItemSliding) {
    this.alertCtrl.create({
      header: 'Delete!',
      message:
        '<strong>Are you sure you want to delete ?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            slidingEl.close();
          },
        },
        {
          text: 'Okay',
          handler: () => {
            slidingEl.close();
            this.loadingCtrl
              .create({ keyboardClose: true, message: 'Deleteing...' })
              .then((loadingEl) => {
                loadingEl.present();
                this.salespipelineService.deleteClientSalesPipeline(id).subscribe(() => {});
                this.salespipelineService.deleteSalesPipeline(clientId).subscribe(() => {
                  this.filterClient();
                  loadingEl.dismiss();
                });
              });
          },
        },
      ],
    })
    .then((alertEl) => {
      alertEl.present();
    });
  }
  doRefresh(event) {
    this.salespipelineService.fetchClientAndSaplesPipeline().subscribe(() => {
      event.target.complete();
    });
  }

  filterClient() {
    // item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    // this.listSalespipeline = this.loadedSalespipeline.filter((sales) => {
    //  return sales.client.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    // });
  }
  convertTimestampToDate(date:any){
    let isodate= this.salespipelineService.convertTimeStampToDate(date);
    var dd = String(isodate.getDate()).padStart(2, '0');
    var mm = String(isodate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = isodate.getFullYear();
    return  dd + '/' + mm  + '/' + yyyy;
   }
   onFilterUpdate(ev: any) {
    this.relevantClientSales=this.applyFilter(ev.detail.value);
  }
  applyFilter(value:string){
    let filterClient: ClientSales[] = [];
    if (value == '1') {
      this.loadedClientSales.forEach((sp) => {
        let flag: boolean = false;
        sp.clientsale.locations.forEach((sploc) => {
          if (sploc.currentStatus == 'S7 : Win') {
            flag = true;
          }
        });
        if(this.searchElement!=undefined && flag){
          let serchTerm = this.searchElement.value;
          if (sp.client.name.toLowerCase().indexOf(serchTerm.toLowerCase()) > -1) {
            flag = true;
          } else {
            flag = false;
          }
        }
        if (flag) {
          filterClient.push(sp);
        }
      });
      return filterClient.sort((a,b)=>a.client.name.localeCompare(b.client.name));
    } else if (value == '2') {
      this.loadedClientSales.forEach((sp) => {
        let flag: boolean = false;
        sp.clientsale.locations.forEach((sploc) => {
          if (sploc.currentStatus == 'S8 : Loss') {
            flag = true;
          }
        });
        if(this.searchElement!=undefined && flag){
          let serchTerm = this.searchElement.value;
          if (sp.client.name.toLowerCase().indexOf(serchTerm.toLowerCase()) > -1) {
            flag = true;
          } else {
            flag = false;
          }
        }
        if (flag) {
          filterClient.push(sp);
        }
      });

      return filterClient.sort((a,b)=>a.client.name.localeCompare(b.client.name));
    } else if (value == '0') {
      this.loadedClientSales.forEach((sp) => {
        let flag: boolean = false;
        sp.clientsale.locations.forEach((sploc) => {
          if (sploc.currentStatus != 'S7 : Win' && sploc.currentStatus != 'S8 : Loss') {
            flag = true;
          }
        });
        if(this.searchElement!=undefined && flag){
          let serchTerm = this.searchElement.value;
          if (sp.client.name.toLowerCase().indexOf(serchTerm.toLowerCase()) > -1) {
            flag = true;
          } else {
            flag = false;
          }
        }
        if (flag) {
          filterClient.push(sp);
        }
      });
      return filterClient.sort((a,b)=>a.client.name.localeCompare(b.client.name));
    }
    else {
      return this.loadedClientSales;
    }
  }
  search($event){
    this.relevantClientSales=this.applyFilter(this.segmentButton.value);
  }
  async downloadXL(){
    var arr=await this.reportService.downloadSalesPipeline();
     var ws=XLSX.utils.json_to_sheet(arr);
     var wb={Sheets:{'data':ws},SheetNames:['data']};
     var buffer=XLSX.write(wb,{bookType:'xlsx',type:'array'});
     var fileType='application/vnd.openxmlformat-officedocument.spreadsheetml.sheet';
     var fileExtention='.xlsx';
     var filename=Date.now().toString();
     var data:Blob=new Blob([buffer],{type:fileType});
     if (this.plt.is('cordova')) {
     this.file
           .writeFile(this.file.externalRootDirectory, `${filename}${fileExtention}`, data, {
             replace: true,
           })
           .then((fileEntry) => {
             this.toastController
             .create({
               message:
                 'File Saved.',
               duration: 2000,
               color: 'Success',
             })
             .then((tost) => {
               tost.present();
             });
           });
         }
         else{
           FileSaver.saveAs(data, `${filename}${fileExtention}`);
           this.toastController
           .create({
             message:
               'File Saved.',
             duration: 2000,
             color: 'Success',
           })
           .then((tost) => {
             tost.present();
           });
         }
   }


}
