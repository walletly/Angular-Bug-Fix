import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BrandService } from './brand.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private firebaseAuth: AngularFireAuth,
    private ngZone: NgZone,
    public  router:  Router,
    private afs: AngularFirestore,
    private brandService: BrandService
  ) { }

  user: Observable<any>;

  createUser(body) {
    return this.http.post(SERVER_API_URL + 'auth', body);
  }

  createFbUser(body) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.post(SERVER_API_URL + 'auth/fbUser', body, { headers: httpHeaders});
  }

  updateUser(id, body) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.put(SERVER_API_URL + 'auth/' + id, body, { headers: httpHeaders});
  }

  getUser(id) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    console.log('x-auth-token:', `Bearer ${localStorage.getItem('usertoken')}`);
    console.log('x-auth-user:', localStorage.getItem('userID'));
    console.log(id);
    return this.http.get(SERVER_API_URL + 'auth/' + id, { headers: httpHeaders});
  }

  getUserByEmail(email) {
    return this.http.get(SERVER_API_URL + 'auth/email/' + email);
  }

  deleteUser(id) {
    return this.http.delete(SERVER_API_URL + 'auth/' + id );
  }

  getFacebookInfo(fbId) {
    const httpHeaders = new HttpHeaders ({
      'x-auth-token': `Bearer ${localStorage.getItem('usertoken')}`,
      'x-auth-user': localStorage.getItem('userID')
    });
    return this.http.get(SERVER_API_URL + 'utils/page/' + fbId, { headers: httpHeaders});
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
