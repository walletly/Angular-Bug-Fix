import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient) { }

  createBusiness(body) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'business', body, { headers: httpHeaders});
  }

  addUser(body) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'business/addUser', body, { headers: httpHeaders});
  }

  getUsers(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'brand/getBrandUsers/' + id, { headers: httpHeaders});
  }

  getBrandUsers(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders});
  }

  updateBusinessUser(id, body) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'business/updateUser/' + id, body, { headers: httpHeaders});
  }

  changeUserAccess(user_id, brand_id, body) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'business/changeUserAccess/' + user_id + '/' + brand_id, body, { headers: httpHeaders});
  }

  deleteBusinessUser(user_id, brand_id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.delete(SERVER_API_URL + 'business/deleteUser/' + user_id + '/' + brand_id, { headers: httpHeaders});
  }

  getBusinessById(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'business/' + id, { headers: httpHeaders});
  }

  getBusinessByBrands(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'business/bybrand/' + id, { headers: httpHeaders});
  }

  sendEmail(arrayEmails) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID'),
      'Content-Type': 'application/json'
    });
    return this.http.post(SERVER_API_URL + 'utils/sendEmail', arrayEmails, { headers: httpHeaders});
  }
}
