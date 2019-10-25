import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  reportBrand(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'report/brand/' + id, { headers: httpHeaders});
  }

  reportBrandBetweenDates(id, from, to) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'report/brand/' + id + '/' + from + '/' + to, { headers: httpHeaders});
  }

  reportBrandSubscribers(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id, { headers: httpHeaders});
  }

  reportBrandSubscribersBetweenDates(id, from, to) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'report/brand/subscribers/' + id + '/' + from + '/' + to, { headers: httpHeaders});
  }

  reportBrandTransactionsBetweenDates(id, from, to) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'report/transactions/' + id + '/' + from + '/' + to, { headers: httpHeaders});
  }
}
