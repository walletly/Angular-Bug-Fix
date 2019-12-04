import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { from } from 'rxjs';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class ManychatService {

  constructor(private http: HttpClient, private mainService: MainService) { }

  getCustomFields(apikey) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'utils/manychat/getcustomfields/' + apikey, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'utils/manychat/getcustomfields/' + apikey, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }

  getPageInfo(apikey) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'utils/manychat/getPageInfo/' + apikey, { headers: httpHeaders}).toPromise();
          return result;
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'utils/manychat/getPageInfo/' + apikey, { headers: httpHeaders}).toPromise();
            return result;
          }else{
            throw error
          }
        }
      })
    );
  }
}
