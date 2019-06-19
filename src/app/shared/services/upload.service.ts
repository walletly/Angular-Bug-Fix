import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadPhoto(file: FormData, folder) {
    const httpHeaders = new HttpHeaders ({
      'x-amz-meta-fieldname': 'image',
      'brand-folder': folder
    });
    return this.http.post(SERVER_API_URL + 'utils/image', file, { headers: httpHeaders});
  }

}
