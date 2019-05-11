import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  private httpHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  createBrand(body) {
    return this.http.post(SERVER_API_URL + 'brand', body, { headers: this.httpHeaders});
  }

  updateBrand(id, body) {
    return this.http.put(SERVER_API_URL + 'brand/' + id, body, { headers: this.httpHeaders});
  }

  getBrandById(id) {
    return this.http.get(SERVER_API_URL + 'brand/' + id);
  }

  getUsersBrands(id) {
    return this.http.get(SERVER_API_URL + 'brand/user/' + id);
  }
}
