import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient) { }

  createBusiness(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'business', body, { headers: httpHeaders}).toPromise();
    }));
  }

  addUser(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'business/addUser', body, { headers: httpHeaders}).toPromise();
    }));
  }

  getUsers(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'brand/getBrandUsers/' + id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandUsers(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders}).toPromise();
    }));
  }

  updateBusinessUser(id, body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.put(SERVER_API_URL + 'business/updateUser/' + id, body, { headers: httpHeaders}).toPromise();
    }));
  }

  changeUserAccess(user_id, brand_id, body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.put(SERVER_API_URL + 'business/changeUserAccess/' + user_id + '/' + brand_id, body, { headers: httpHeaders}).toPromise();
    }));
  }

  deleteBusinessUser(user_id, brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.delete(SERVER_API_URL + 'business/deleteUser/' + user_id + '/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBusinessById(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBusinessByBrands(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'business/bybrand/' + id, { headers: httpHeaders}).toPromise();
    }));
  }

  sendEmail(arrayEmails) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'utils/sendEmail', arrayEmails, { headers: httpHeaders}).toPromise();
    }));
  }
}
