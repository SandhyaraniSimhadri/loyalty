import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/api/paymob'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  authenticate() {
    return this.http.post(`${this.apiUrl}/authenticate`, {});
  }

  createOrder(authToken: string, amountCents: number) {
    return this.http.post(`${this.apiUrl}/create-order`, { auth_token: authToken, amount_cents: amountCents });
  }

  generatePaymentKey(authToken: string, orderId: string, billingData: any, amountCents: number) {
    return this.http.post(`${this.apiUrl}/payment-key`, {
      auth_token: authToken,
      order_id: `${orderId}`,
      billing_data: billingData,
      amount_cents: amountCents,
    });
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class PaymentService {
//   private baseUrl = 'http://localhost:8000/api';

//   constructor(private http: HttpClient) {}

//   createOrder(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/paymob/create-order`, data);
//   }

//   generatePaymentKey(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/paymob/payment-key`, data);
//   }
// }
