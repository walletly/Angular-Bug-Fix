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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/' + id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  reportBrandBetweenDates(id, from, to) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/brand/' + id + '/' + from + '/' + to, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/' + id + '/' + from + '/' + to, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  reportBrandSubscribersBetweenDates(id, from, to) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id + '/' + from + '/' + to, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id + '/' + from + '/' + to, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  reportBrandTransactionsBetweenDates(id, from, to) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'report/transactions/' + id + '/' + from + '/' + to, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'report/transactions/' + id + '/' + from + '/' + to, { headers: httpHeaders}).toPromise();
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
