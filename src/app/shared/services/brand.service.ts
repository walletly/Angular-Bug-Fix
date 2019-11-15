import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  connectBrand(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'brand/connect', body, { headers: httpHeaders}).toPromise();
    }));
  }

  updateBrand(id, body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.put(SERVER_API_URL + 'brand/' + id, body, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandById(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'brand/' + id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandName(id) {
    return this.http.get(SERVER_API_URL + 'brand/name/' + id);
  }

  getUsersBrands(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'brand/user/' + id, { headers: httpHeaders}).toPromise();
    }));
  }

  assoisiateBrand(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'brand/associate', body, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandCouponAudience(brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'coupon/audience/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandStampCardAudience(brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'stampCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandTicketAudience(brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'ticket/audience/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandLoyaltyCardAudience(brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'loyaltyCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandMembershipCardAudience(brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'membershipCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  changeMembershipCardStatus(membershipCard_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'membershipCard/changeStatus/' + membershipCard_id, {}, { headers: httpHeaders}).toPromise();
    }));
  }

  addIbeacon(brand_id, body){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'ibeacon/addIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
    }));
  }

  updateIbeacon(brand_id, body){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.put(SERVER_API_URL + 'ibeacon/updateIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandAdmins(brand_id){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'brand/getBrandAdmins/' + brand_id, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandSubscribers(brand_id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'brand/subscribers/' + brand_id, { headers: httpHeaders }).toPromise();
    }));
  }
}
