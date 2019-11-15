import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {

  constructor(private http: HttpClient) { }

  addChatbotQR(body) {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'Content-Type': 'application/json',
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.post(SERVER_API_URL + 'chatbotQR/addChatbotQR', body, { headers: httpHeaders}).toPromise();
    }));
  }

}
