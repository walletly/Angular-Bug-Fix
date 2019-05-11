import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  private httpHeaders = new HttpHeaders ({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  uploadPhoto(file: FormData) {
    return this.http.post(SERVER_API_URL + 'utils/image', file, { headers: this.httpHeaders});
  }

}
