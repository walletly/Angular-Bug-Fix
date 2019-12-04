import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  reportBrand(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/brand/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  reportBrandBetweenDates(id, startDate, endDate) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/brand/' + id + '/' + startDate + '/' + endDate, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/' + id + '/' + startDate + '/' + endDate, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  reportBrandSubscribers(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  reportBrandSubscribersBetweenDates(id, startDate, endDate) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id + '/' + startDate + '/' + endDate, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id + '/' + startDate + '/' + endDate, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  reportBrandTransactionsBetweenDates(id, startDate, endDate) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/transactions/' + id + '/' + startDate + '/' + endDate, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/transactions/' + id + '/' + startDate + '/' + endDate, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }
}
