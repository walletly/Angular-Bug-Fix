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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'brand/connect', body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'brand/' + id, body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/' + id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/user/' + id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'brand/associate', body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'coupon/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'stampCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'ticket/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'loyaltyCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'membershipCard/audience/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'membershipCard/changeStatus/' + membershipCard_id, {}, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'ibeacon/addIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'ibeacon/updateIbeacon/' + brand_id, body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/getBrandAdmins/' + brand_id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
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
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'brand/subscribers/' + brand_id, { headers: httpHeaders }).toPromise();
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
