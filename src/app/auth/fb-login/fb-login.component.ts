import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BrandService } from 'src/app/shared/services/brand.service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-fb-login',
  templateUrl: './fb-login.component.html',
  styleUrls: ['./fb-login.component.scss']
})
export class FbLoginComponent implements OnInit {
  terms;
  termsError;
  showLoader = true;

  constructor(private authService: AuthService,
    private firebaseAuth: AngularFireAuth,
    private ngZone: NgZone,
    public router: Router,
    private afs: AngularFirestore,
    private brandService: BrandService,
    private mainServ: MainService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.firebaseAuth.auth.getRedirectResult()
      .then(async res => {
        console.log(res);
        if(localStorage.getItem('loggedOut') == 'true'){
          localStorage.clear();
          this.showLoader = false;
          return;
        }
        if (res.user) {
          console.log(res);
          const firstname = res.additionalUserInfo.profile['first_name'];
          const lastname = res.additionalUserInfo.profile['last_name'];
          const email = res.user.email;
          const uid = res.user.uid;
          const photo = res.user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
          const newUser = res.additionalUserInfo.isNewUser;

          localStorage.setItem('userID', res.user.uid);
          localStorage.setItem('usertoken', await res.user.getIdToken());
          localStorage.setItem('access', res.credential['accessToken']);
          console.log(newUser);

          if (newUser) {
            // create user in firestore
            console.log('newUser');

            const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
            await userRef.set({
              account_type: 'starter',
              created_at: new Date(),
              firstname: firstname,
              lastname: lastname,
              email: email,
              marketing: true,
              user_type: 1,
              avatar: photo
            });
          } else{
            const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
            await userRef.update({
              avatar: photo
            });
          }
          this.getUser(uid);
        } else {
          this.showLoader = false;
        }
      }).catch( async err => {
        if(localStorage.getItem('loggedOut') == 'true'){
          localStorage.clear();
          this.showLoader = false;
          return;
        }
        if (err.code == "auth/account-exists-with-different-credential"){
          localStorage.setItem('access', err.credential['accessToken']);
          firebase.auth().fetchSignInMethodsForEmail(err.email)
            .then(providers => {
              firebase.auth().signInWithEmailAndPassword(err.email, 'asdf1234')
              .then(async result=>{
                result.user.linkAndRetrieveDataWithCredential(err.credential);
                localStorage.setItem('userID', result.user.uid);
                localStorage.setItem('usertoken', await result.user.getIdToken());
                const uid = result.user.uid;
                const photo = result.user.providerData[0].photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
                const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
                await userRef.set({
                  account_type: 'starter',                  
                  marketing: true,
                  user_type: 1,
                  avatar: photo
                }, {merge: true});
                this.getUser(uid);
              }).catch(err =>{
                console.log('link error',err);
              })
            });
        }
      });
    }, 1000);
  }

  getUser(uid){
    this.authService.getUser(uid).subscribe(data => {
      console.log(data);
      localStorage.setItem('user', JSON.stringify(data['data']));
      if (data['data']['activeBrand']) {
        this.brandService.getBrandById(data['data']['activeBrand']).subscribe(res_brand => {
          console.log(res_brand);
          localStorage.setItem('currentBrand', JSON.stringify(res_brand['brand']));
          this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
          this.showLoader = false;
        }, err => {
          this.ngZone.run(() => this.router.navigate(['/fb-connect']));
          this.showLoader = false;
        });
      } else {
        this.ngZone.run(() => this.router.navigate(['/fb-connect']));
        this.showLoader = false;
      }
    }, err => {
      this.showLoader = false;
      console.log(err);
    });
  }

  loginFB() {
    if (this.terms) {
      this.firebaseAuth.auth.signOut();
      this.authService.doFacebookLogin();
    } else {
      this.termsError = true;
    }
  }
}
