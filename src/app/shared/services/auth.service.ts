import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { from } from 'rxjs';
import { MainService } from './main.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private mainService: MainService
  ) { }

  user: Observable<any>;

  createUser(body) {
    return this.http.post(SERVER_API_URL + 'auth', body);
  }

  createFbUser(body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.post(SERVER_API_URL + 'auth/fbUser', body, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.post(SERVER_API_URL + 'auth/fbUser', body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  updateUser(id, body) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.put(SERVER_API_URL + 'auth/' + id, body, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.put(SERVER_API_URL + 'auth/' + id, body, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  getUser(id) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'auth/' + id, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'auth/' + id, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  getUserByEmail(email) {
    return this.http.get(SERVER_API_URL + 'auth/email/' + email);
  }

  deleteUser(id) {
    return this.http.delete(SERVER_API_URL + 'auth/' + id );
  }

  getFacebookInfo(fbId) {
    return from(
      this.mainService.getHttpHeaders().then(async httpHeaders => {
        let result;
        try {
          result = await this.http.get(SERVER_API_URL + 'utils/page/' + fbId, { headers: httpHeaders}).toPromise();
        } catch (error) {
          if(error['error'].error == 'token expired'){
            httpHeaders = await this.mainService.refreshHttpHeaders();
            result = await this.http.get(SERVER_API_URL + 'utils/page/' + fbId, { headers: httpHeaders}).toPromise();
          }else{
            throw error
          }
        } finally {
          return result;
        }
      })
    );
  }

  signInWithFacebook() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  doFacebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('manage_pages');
    provider.addScope('email');
    // provider.addScope('publish_pages');
    // provider.addScope('pages_show_list');
    this.firebaseAuth.auth.signInWithRedirect(provider);
  }
}
