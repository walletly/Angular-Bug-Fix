import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { masterAdmin_API_URL } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  getStats() {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(masterAdmin_API_URL + 'report/getStats', { headers: httpHeaders});
  }
}
