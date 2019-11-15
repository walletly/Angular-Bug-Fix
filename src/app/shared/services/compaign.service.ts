import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaignService {

  constructor(private http: HttpClient) { }

  createСampaign(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeadersWithCT = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'campaign', body, { headers: httpHeadersWithCT }).toPromise();
    }));
  }

  updateСampaign(id, body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeadersWithCT = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.put(SERVER_API_URL + 'campaign/' + id, body, { headers: httpHeadersWithCT }).toPromise();
    }));
  }

  deleteСampaign(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const deleteOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-auth-token': `Bearer ${token}`,
          'x-auth-user': userID
        }),
        body: body
      };
      return this.http.delete(SERVER_API_URL + 'campaign', deleteOptions).toPromise();
    }));
  }

  getСampaignById(id) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'campaign/' + id, { headers: httpHeaders }).toPromise();
    }));
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
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeadersWithCT = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'campaign/all/' + id, body, { headers: httpHeadersWithCT }).toPromise();
    }));
  }

  sendCampaignNotification(campaign_id, body){
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'campaign/notification/' + campaign_id, body, { headers: httpHeaders }).toPromise();
    }));
  }
}
