
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }

  get WindowRef() {
    return window;
  }

  createOrder(orderDetails) {
    return this.http.post(environment.cloudFunctions.createOrder, orderDetails);
  }

  capturePayment(paymemntDetails) {
    return this.http.post(environment.cloudFunctions.capturePayment,paymemntDetails);
}
}
