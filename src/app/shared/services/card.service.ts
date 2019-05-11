import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  private httpHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  createCard(body) {
    return this.http.post(SERVER_API_URL + 'card', body, { headers: this.httpHeaders});
  }

  deleteCard(cardId) {
    return this.http.delete(SERVER_API_URL + 'card/' + cardId);
  }

  getBrandsCards(brandId) {
    return this.http.get(SERVER_API_URL + 'card/all/' + brandId);
  }

  getCardById(cardId) {
    return this.http.get(SERVER_API_URL + 'card/' + cardId);
  }

  getCardByType(cardType: number, brandId: string) {
    return this.http.get(SERVER_API_URL + `card/type/${cardType}/${brandId}`);
  }

  updateCard(cardId, body) {
    return this.http.put(SERVER_API_URL + 'card/' + cardId, body);
  }
}
