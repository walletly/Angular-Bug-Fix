import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  createCard(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'card', body, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'card', body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  deleteCard(cardId) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.delete(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.delete(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  getBrandsCards(brandId) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'card/all/' + brandId, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'card/all/' + brandId, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  getCardById(cardId) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'card/' + cardId, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  getCardByType(cardType: number, brandId: string) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + `card/type/${cardType}/${brandId}`, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + `card/type/${cardType}/${brandId}`, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  updateCard(cardId, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'card/' + cardId, body, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'card/' + cardId, body, { headers: httpHeaders}).toPromise();
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
