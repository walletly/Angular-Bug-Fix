import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  createCard(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'card', body, { headers: httpHeaders}).toPromise();
    }));
  }

  deleteCard(cardId) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.delete(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders}).toPromise();
    }));
  }

  getBrandsCards(brandId) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'card/all/' + brandId, { headers: httpHeaders}).toPromise();
    }));
  }

  getCardById(cardId) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders}).toPromise();
    }));
  }

  getCardByType(cardType: number, brandId: string) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(SERVER_API_URL + `card/type/${cardType}/${brandId}`, { headers: httpHeaders}).toPromise();
    }));
  }

  updateCard(cardId, body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.put(SERVER_API_URL + 'card/' + cardId, body, { headers: httpHeaders}).toPromise();
    }));
  }
}
