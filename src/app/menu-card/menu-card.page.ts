import { environment } from './../../environments/environment';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { WebBluetoothService } from '../services/web-bluetooth/web-bluetooth.service';
import { PaymentService } from '../services/cart/payment.service';
import { MenuController,LoadingController,AlertController,ToastController } from '@ionic/angular';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-menu-card',
  templateUrl: './menu-card.page.html',
  styleUrls: ['./menu-card.page.scss','./../../../node_modules//bootstrap/dist/css/bootstrap.min.css'],
})
export class MenuCardPage implements OnInit {
  products: any[] = [];
  objectKeys = Object.keys;
  totalPrice = 0;
  quantity = 0;
  payableAmount = 0;
  WindowRef: any;
  processingPayment: boolean;
  paymentResponse:any = {};
  isdispatch:boolean= false;
  constructor(private ble:WebBluetoothService,private paymentService:PaymentService,
    private changeRef: ChangeDetectorRef,private menu: MenuController,private loadingCtrl: LoadingController,   private alertController: AlertController, public toastController: ToastController) { }
  ngOnInit() {
    // this.cartService.getCartItems()
    // .subscribe(cartItems => {
    //   this.products = cartItems;
    //   this.calculatePrice();
    // });
      this.products=[
        {
          id:1, name:'Espresso',description:'Black Coffee - 30 ml shot',img:'../../assets/icon/images/menu-2-1.png',quantity:0,code:'A#1001',rate:12,paymentgetWay:false
        },
        {
          id:2, name:'Americano',description:'Black Coffee - Long Shot',img:'../../assets/icon/images/menu-2-2.png',quantity:0,code:'A#1002',rate:12,paymentgetWay:false
        },
        {
          id:3, name:'Cappuccino',description:'Milk Coffee with foam',img:'../../assets/icon/images/menu-2-3.png',quantity:0,code:'A#1003',rate:12,paymentgetWay:false
        },
        {
          id:4, name:'Cafelatte',description:'Milk Coffee without foam',img:'../../assets/icon/images/menu-2-4.png',quantity:0,code:'A#1004',rate:12,paymentgetWay:false
        },
        {
          id:5, name:'Tea',description:'Dip Tea (Hot water + Tea Bag)',img:'../../assets/icon/images/menu-2-5.png',quantity:0,code:'A#1005',rate:12,paymentgetWay:false
        },
        {
          id:6, name:'Milk',description:'Plain Milk',img:'../../assets/icon/images/menu-2-6.png',quantity:0,code:'A#1006',rate:12,paymentgetWay:false
        },
      ];




    this.WindowRef = this.paymentService.WindowRef;
  }

 openMenu(){
    if(this.quantity>0){
    this.menu.enable(true, 'first');
    this.menu.open('first');
    }
 }
closemenu(){
   this.menu.close('first');
  this.isdispatch=false;
}

checkout(){
  this.isdispatch=true;
}
goback(){
  this.isdispatch=false;
}
resetcart(){
  this.isdispatch=false;
}
clearcart(){
  this.products.forEach(product=>{
    product.quantity=0;
  });
   this.quantity=0;
    this.isdispatch=false;
    this.closemenu();
}
dispatch(){
this.alertController.create({
    header: 'Dispatch?',
    message:
      '<strong>Are you sure you want proceed for dispatch?</strong>',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        },
      },
      {
        text: 'Okay',
        handler:async (data) => {

          if(!this.ble.ispaired())
          await this.ble.discoverbledevice();

           this.loadingCtrl.create({ keyboardClose: true,  message: 'Please wait...',  cssClass: 'menu-loader', }).then(async (loadingEl) => {
            loadingEl.present();
            let productList:any=[];
            let selectedProducts:any=[];
            this.products.forEach(product => {
              if(product.quantity>0){
                for(let i=0;i<product.quantity;i++){
                  selectedProducts.push(product);
                }
              }
            });
            productList=[{selectedproduct:selectedProducts}];
            // await Promise.all(selectedProducts.map(async (product) => {

            //   await new Promise( resolve => setTimeout(resolve, 10000) );
            //   await this.ble.writeValue(product);
            // }));


            await Promise.all(productList.map(async (product) => {
                for(let i=0;i<product.selectedproduct.length;i++){
                  await this.ble.writeValue(product.selectedproduct[i].code);
                  await new Promise( resolve => setTimeout(resolve, 5000) );
                }
            }));


            // await Promise.all(this.products.map(async (product) => {
            //   if(product.quantity>0){
            //     for(let i=0;i<product.quantity;i++){
            //       await this.ble.writeValue(product.code);
            //       await new Promise( resolve => setTimeout(resolve, 10000) );
            //     }
            //   }
            // }));
            loadingEl.dismiss();
            this.ble.disconnectDevice();
            this.clearcart();
            await this.toastController.create({
              message: 'Successfully dispatched your order.',
              duration: 2000,
              color:'success',
            }).then((tost)=>{
              tost.present();
            });
          });






        },
      },
    ],
  }).then((alertEl) => {
    alertEl.present();
  });




}

  getValue(object) {
    const key = this.objectKeys(object);
    return object[key.toString()];
  }

  async increaseProductQuantity(product) {
    if((this.quantity+1)>10){
    await this.toastController.create({
      message: 'You can not add more than 10 items at one instance.',
      duration: 2000,
      color:'danger',
    }).then((tost)=>{
      tost.present();
    });
    return;
  }
    product.quantity++;
    this.quantity += 1;
    this.totalPrice += product.price;
  }

  decreaseProductQuantity(product) {
    product.quantity--;
    this.quantity -= 1;
    this.totalPrice -= product.price;
  }

  deletecartproduct(product){
    this.quantity = this.quantity - product.quantity;
    product.quantity=0;
    if(this.quantity==0){
      this.closemenu();
    }
  }


  calculatePrice() {
    this.totalPrice = 0;
    this.quantity = 0;
    for(let i = 0; i < this.products.length;i++) {
      this.totalPrice += this.products[i].quantity * this.products[i].price ;
      this.quantity += this.products[i].quantity ;
    }
  }

  async proceedToPay($event) {

    if(!this.ble.ispaired())
    await this.ble.discoverbledevice();

    this.processingPayment = true;
    this.payableAmount =  this.totalPrice * 100 ;
    this.initiatePaymentModal($event);
  }


  initiatePaymentModal(event) {

    let receiptNumber = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
    let orderDetails = {
      //amount: this.payableAmount,
      amount: 100,
      receipt: receiptNumber
    }

    this.paymentService.createOrder(orderDetails)
        .subscribe(order => {
        console.log("TCL: CheckoutComponent -> initiatePaymentModal -> order", order)
          var rzp1 = new this.WindowRef.Razorpay(this.preparePaymentDetails(order));
          this.processingPayment = false;
          rzp1.open();
          event.preventDefault();
        }, error => {
        console.log("TCL: CheckoutComponent -> initiatePaymentModal -> error", error)

        })

   }


   preparePaymentDetails(order){
    console.log(order);
    var ref = this;
    return  {
      "key": environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      "amount": 100, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
      "name": 'Pay',
      "currency": order.currency,
      "order_id": order.id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
      "image": 'https://angular.io/assets/images/logos/angular/angular.png',
      "handler": function (response){
        ref.handlePayment(response);
      },
      "prefill": {
          "name": `Angular Geeks`
      },
      "theme": {
          "color": "#2874f0"
      }
     };
   }

  async handlePayment(response) {
    this.paymentService.capturePayment({
      amount: this.payableAmount,
      payment_id: response.razorpay_payment_id
    })
      .subscribe(async res =>  {
        this.paymentResponse = res;
        await this.ble.writeValue("A#1001");
        this.ble.disconnectDevice();
        this.changeRef.detectChanges();
       },
      error => {
        this.paymentResponse = error;
      });
  }




   async getDevice(){
     await this.ble.writeValue("A#1001");
   }

  }
