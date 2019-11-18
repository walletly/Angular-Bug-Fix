import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeSubscriptionService {

  constructor(private http: HttpClient) { }

  makeCustomerSubscription(customerData){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'stripe/makeCustomerSubscription', customerData, { headers: httpHeaders}).toPromise();
    }));
  }

  changeCustomerCard(customerData){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'stripe/changeCustomerCard', customerData, { headers: httpHeaders}).toPromise();
    }));
  }

  getSubscription(brand_id){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'stripe/getSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  deleteSubscription(brand_id){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.delete(SERVER_API_URL + 'stripe/deleteSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

}
