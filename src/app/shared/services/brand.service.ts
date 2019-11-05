import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  // createBrand(body) {
  //   const httpHeaders = new HttpHeaders ({
  //     'Content-Type': 'application/json',
  //     'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
  //     'x-auth-user': localStorage.getItem('userID')
  //   });
  //   return this.http.post(SERVER_API_URL + 'brand', body, { headers: httpHeaders});
  // }

  connectBrand(body) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'brand/connect', body, { headers: httpHeaders});
  }

  updateBrand(id, body) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'brand/' + id, body, { headers: httpHeaders});
  }

  getBrandById(id) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'brand/' + id, { headers: httpHeaders});
  }

  getBrandName(id) {
    return this.http.get(SERVER_API_URL + 'brand/name/' + id);
  }

  getUsersBrands(id) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'brand/user/' + id, { headers: httpHeaders});
  }

  assoisiateBrand(body) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'brand/associate', body, { headers: httpHeaders});
  }

  getBrandCouponAudience(brand_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'coupon/audience/' + brand_id, { headers: httpHeaders});
  }

  getBrandStampCardAudience(brand_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'stampCard/audience/' + brand_id, { headers: httpHeaders});
  }

  getBrandTicketAudience(brand_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'ticket/audience/' + brand_id, { headers: httpHeaders});
  }

  getBrandLoyaltyCardAudience(brand_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'loyaltyCard/audience/' + brand_id, { headers: httpHeaders});
  }

  getBrandMembershipCardAudience(brand_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'membershipCard/audience/' + brand_id, { headers: httpHeaders});
  }

  changeMembershipCardStatus(membershipCard_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'membershipCard/changeStatus/' + membershipCard_id, { headers: httpHeaders});
  }

  addIbeacon(brand_id, body){
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'ibeacon/addIbeacon/' + brand_id, body, { headers: httpHeaders});
  }

  updateIbeacon(brand_id, body){
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'ibeacon/updateIbeacon/' + brand_id, body, { headers: httpHeaders});
  }

  getBrandAdmins(brand_id){
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'brand/getBrandAdmins/' + brand_id, { headers: httpHeaders});
  }

  brandPayment(body){
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'stripe/makeCharge/', body, { headers: httpHeaders});
  }

  isBrandPaymentDue(brand_id){
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'brand/payment/' + brand_id, { headers: httpHeaders});
  }


}
