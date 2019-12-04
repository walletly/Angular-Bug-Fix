import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  connectBrand(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'brand/connect', body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'brand/connect', body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  updateBrand(id, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'brand/' + id, body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'brand/' + id, body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandById(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'brand/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandName(id) {
    return this.http.get(SERVER_API_URL + 'brand/name/' + id);
  }

  getUsersBrands(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'brand/user/' + id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/user/' + id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  assoisiateBrand(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'brand/associate', body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'brand/associate', body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandCouponAudience(brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'coupon/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'coupon/audience/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandStampCardAudience(brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'stampCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'stampCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandTicketAudience(brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'ticket/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'ticket/audience/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandLoyaltyCardAudience(brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'loyaltyCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'loyaltyCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandMembershipCardAudience(brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'membershipCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'membershipCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  changeMembershipCardStatus(membershipCard_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'membershipCard/changeStatus/' + membershipCard_id, {}, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'membershipCard/changeStatus/' + membershipCard_id, {}, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  addIbeacon(brand_id, body){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'ibeacon/addIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'ibeacon/addIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  updateIbeacon(brand_id, body){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'ibeacon/updateIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'ibeacon/updateIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandAdmins(brand_id){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'brand/getBrandAdmins/' + brand_id, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/getBrandAdmins/' + brand_id, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getBrandSubscribers(brand_id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'brand/subscribers/' + brand_id, { headers: httpHeaders }).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/subscribers/' + brand_id, { headers: httpHeaders }).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

}
