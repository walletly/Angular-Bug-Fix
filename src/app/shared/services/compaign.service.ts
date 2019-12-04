import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';


@Injectable({
  providedIn: 'root'
})
export class CompaignService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  createСampaign(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'campaign', body, { headers: httpHeaders }).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'campaign', body, { headers: httpHeaders }).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  updateСampaign(id, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'campaign/' + id, body, { headers: httpHeaders }).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'campaign/' + id, body, { headers: httpHeaders }).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  deleteСampaign(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          const deleteOptions = {
            headers: httpHeaders,
            body: body
          };
          result = await this.http.delete(SERVER_API_URL + 'campaign', deleteOptions).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            const deleteOptions = {
              headers: await this.mainService.refreshHttpHeaders(),
              body: body
            };
            result = await this.http.delete(SERVER_API_URL + 'campaign', deleteOptions).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getСampaignById(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'campaign/' + id, { headers: httpHeaders }).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'campaign/' + id, { headers: httpHeaders }).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getСampaignByCode(code) {
    return this.http.get(SERVER_API_URL + 'campaign/code/' + code);
  }

  postCampaignCard(card_type, brand_apikey, body ){
    const httpHeadersWithCT = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-api-key': brand_apikey
    });
    return this.http.post(SERVER_API_URL + card_type, body, { headers: httpHeadersWithCT });
  }

  getСampaignsBrands(id, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'campaign/all/' + id, body, { headers: httpHeaders }).toPromise();
          return result;
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'campaign/all/' + id, body, { headers: httpHeaders }).toPromise();
            return result;
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  sendCampaignNotification(campaign_id, body){
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'campaign/notification/' + campaign_id, body, { headers: httpHeaders }).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'campaign/notification/' + campaign_id, body, { headers: httpHeaders }).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }
}
