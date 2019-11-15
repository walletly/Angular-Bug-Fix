import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { masterAdmin_API_URL } from '../../../../environments/environment';
import * as localForage from 'localforage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getStats() {
    return from(localForage.getItem('usertoken').then(async token => {
      const userID: any = await localForage.getItem('userID');
      
      const httpHeaders = new HttpHeaders ({
        'x-auth-token': `Bearer ${token}`,
        'x-auth-user': userID
      });
      return this.http.get(masterAdmin_API_URL + 'report/getStats', { headers: httpHeaders}).toPromise();
    }));
  }
}
