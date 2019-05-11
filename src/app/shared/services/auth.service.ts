import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private firebaseAuth: AngularFireAuth) { }
  // private httpHeaders = new HttpHeaders ({
  //   'Content-Type': 'application/json'
  // });

  user: Observable<any>;

  createUser(body) {
    return this.http.post(SERVER_API_URL + 'auth', body);
  }

  updateUser(id, body) {
    return this.http.put(SERVER_API_URL + 'auth/' + id, body);
  }

  getUser(id) {
    return this.http.get(SERVER_API_URL + 'auth/' + id);
  }

  getFacebookInfo(fbId) {
    return this.http.get(SERVER_API_URL + 'utils/page/' + fbId);
  }

  signInWithFacebook() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }
}
