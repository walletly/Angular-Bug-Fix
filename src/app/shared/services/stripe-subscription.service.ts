import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class StripeSubscriptionService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  makeCustomerSubscription(customerData){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'stripe/makeCustomerSubscription', customerData, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'stripe/makeCustomerSubscription', customerData, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  changeCustomerCard(customerData){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'stripe/changeCustomerCard', customerData, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'stripe/changeCustomerCard', customerData, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  getSubscription(brand_id){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'stripe/getSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'stripe/getSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  deleteSubscription(brand_id){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.delete(SERVER_API_URL + 'stripe/deleteSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.delete(SERVER_API_URL + 'stripe/deleteSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  undeleteSubscription(brand_id){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.delete(SERVER_API_URL + 'stripe/undeleteSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.delete(SERVER_API_URL + 'stripe/undeleteSubscription/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

}
