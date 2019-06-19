import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  createCard(body) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'card', body, { headers: httpHeaders});
  }

  deleteCard(cardId) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.delete(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders});
  }

  getBrandsCards(brandId) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'card/all/' + brandId, { headers: httpHeaders});
  }

  getCardById(cardId) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders});
  }

  getCardByType(cardType: number, brandId: string) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + `card/type/${cardType}/${brandId}`, { headers: httpHeaders});
  }

  updateCard(cardId, body) {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'card/' + cardId, body, { headers: httpHeaders});
  }
}
