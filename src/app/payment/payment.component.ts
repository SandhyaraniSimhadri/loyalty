import { Component } from '@angular/core';
import { PaymentService } from 'app/auth/service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  constructor(private paymentService: PaymentService) {}

  initiatePayment() {
    // this.paymentService.createOrder({ items: [] }).subscribe((order) => {
    //   this.paymentService.generatePaymentKey({
    //     order_id: order.id,
    //     amount: order.total,
    //   }).subscribe((paymentKey) => {
    //     // Initialize Paymob iframe
    //     const iframe = window['Paymob'];
    //     iframe.start({
    //       iframeID: 'paymob-iframe',
    //       integration_id: 'your_integration_id',
    //       iframeURL: 'https://accept.paymob.com/api/acceptance/iframes/your_iframe_id',
    //       payment_key: paymentKey.token,
    //     });
    //   });
    // });
  }
}
