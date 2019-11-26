import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ManychatService {

  constructor(private http: HttpClient) { }

  getCustomFields(apikey) {
    return this.http.get(SERVER_API_URL + 'utils/manychat/getcustomfields/' + apikey);
  }

  getPageInfo(apikey) {
    return this.http.get(SERVER_API_URL + 'utils/manychat/getPageInfo/' + apikey);
  }
}
