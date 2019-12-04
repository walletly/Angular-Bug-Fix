import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  createBusiness(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'business', body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'business', body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  addUser(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'business/addUser', body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'business/addUser', body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getUsers(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'brand/getBrandUsers/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/getBrandUsers/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandUsers(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  updateBusinessUser(id, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'business/updateUser/' + id, body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'business/updateUser/' + id, body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  changeUserAccess(user_id, brand_id, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'business/changeUserAccess/' + user_id + '/' + brand_id, body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'business/changeUserAccess/' + user_id + '/' + brand_id, body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  deleteBusinessUser(user_id, brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.delete(SERVER_API_URL + 'business/deleteUser/' + user_id + '/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.delete(SERVER_API_URL + 'business/deleteUser/' + user_id + '/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBusinessById(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBusinessByBrands(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'business/bybrand/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'business/bybrand/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  sendEmail(arrayEmails) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'utils/sendEmail', arrayEmails, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'utils/sendEmail', arrayEmails, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }
}
