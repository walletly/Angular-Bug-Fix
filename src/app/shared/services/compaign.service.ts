import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaignService {

  constructor(private http: HttpClient) { }

  private httpHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });

  deleteOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    body: {
      id: 1,
      name: 'test',
    },
  };

  createСampaign(body) {
    return this.http.post(SERVER_API_URL + 'campaign', body, { headers: this.httpHeaders });
  }

  updateСampaign(id, body) {
    return this.http.put(SERVER_API_URL + 'campaign/' + id, body, { headers: this.httpHeaders });
  }

  deleteСampaign(body) {
    this.deleteOptions.body = body;
    return this.http.delete(SERVER_API_URL + 'campaign', this.deleteOptions);
  }

  getСampaignById(id) {
    return this.http.get(SERVER_API_URL + 'campaign/' + id);
  }

  getСampaignsBrands(id) {
    return this.http.get(SERVER_API_URL + 'campaign/all/' + id);
  }
}
