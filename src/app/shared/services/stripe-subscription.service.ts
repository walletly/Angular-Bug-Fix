import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeSubscriptionService {

  constructor(private http: HttpClient) { }

  makeCustomerSubscription(customerData){
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'stripe/makeCustomerSubscription', customerData, { headers: httpHeaders});
  }

  getSubscription(brand_id){
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'stripe/getSubscription/' + brand_id, { headers: httpHeaders});
  }

  deleteSubscription(brand_id){
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.delete(SERVER_API_URL + 'stripe/deleteSubscription/' + brand_id, { headers: httpHeaders});
  }

}
