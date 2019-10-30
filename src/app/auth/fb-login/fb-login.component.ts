import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
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
  businessUser = false;
  businessEmail;
  deleteUserId;
  deleteSuccess = false;
  disableButton = false;

  constructor(private authService: AuthService,
    private firebaseAuth: AngularFireAuth,
    private ngZone: NgZone,
    public router: Router,
    private brandService: BrandService,
    private mainServ: MainService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.firebaseAuth.auth.getRedirectResult()
      .then(async res => {
        console.log(res);
        if(localStorage.getItem('loggedOut') == 'true'){
          console.log('loggedOut');
          await this.ngZone.run(() => {
            localStorage.clear();
            this.showLoader = false;
            return;
          });
        }else if(localStorage.getItem('loggedIn') == 'true'){
          console.log('loggedIn');
          this.router.navigate(['/main/dashboard']);
          this.showLoader = false;
          return;
        }
        if (res.user) {
          console.log(res.user);
          const firstname = res.additionalUserInfo.profile['first_name'];
          const lastname = res.additionalUserInfo.profile['last_name'];
          const email = res.user.email || res.additionalUserInfo.profile['email'];
          const user_id = res.user.uid;
          const photo = res.user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
          const newUser = res.additionalUserInfo.isNewUser;

          localStorage.setItem('userID', res.user.uid);
          localStorage.setItem('usertoken', await res.user.getIdToken());
          localStorage.setItem('access', res.credential['accessToken']);
          console.log(newUser);

          if (newUser) {
            // create user in firestore
            console.log('newUser');

            const user = {
              user_id,
              account_type: 'starter',
              firstname,
              lastname,
              email,
              marketing: true,
              user_type: 1,
              avatar: photo
            }
            this.authService.createFbUser(user).subscribe(result => {
              console.log('newUser added in database', result);
              console.log('localStorage:',localStorage);
              console.log('get user called for', user_id); 
              this.getUser(user_id);
            }, err => {
              console.log('Error in creating Fb user in Database', err);
              this.ngZone.run(() => {
                localStorage.clear();
                this.showLoader = false;
                return;
              });
            })
          }else{
            console.log('oldUser');
            this.authService.updateUser(user_id,{ avatar: photo}).subscribe(result => {
              console.log('oldUser updated', result);     
              console.log('localStorage:',localStorage);
              console.log('get user called for', user_id); 
              this.getUser(user_id);
            }, err => {
              console.log('Error in updating Fb user in Database', err);
              console.log('localStorage:',localStorage);
              console.log('get user called for', user_id); 
              this.getUser(user_id);
            })
          }
        } else {
          console.log('no res.user');
          this.ngZone.run(() => {
            localStorage.clear();
            this.showLoader = false;
            return;
          });
        }
      }).catch( async err => {
        console.log('fb login error:',err);
        if(localStorage.getItem('loggedOut') == 'true'){
          this.ngZone.run(() => {
            localStorage.clear();
            this.showLoader = false;
            return;
          });
        }
        if(err.code == 'auth/user-cancelled'){
          this.ngZone.run(() => {
            localStorage.clear();
            this.showLoader = false;
            return;
          });
        }

        this.firebaseAuth.auth.signOut().then(() => {
          localStorage.clear();
          localStorage.setItem('loggedOut', 'true');
          this.router.navigate(['/fb-login']);
        }).catch(()=>{
          localStorage.clear();
          localStorage.setItem('loggedOut', 'true');
          this.router.navigate(['/fb-login']);
        });
        return;

        // let user_type, user_id, tempPassword;
        // const userData = this.authService.getUserByEmail(err.email).subscribe(async data => {
        //   user_type = data['user'].user_type;
        //   user_id = data['user'].user_id;
        //   tempPassword = data['user'].tempPassword;

        //   if(user_type == 2 && err.code == "auth/account-exists-with-different-credential"){
        //     this.ngZone.run(() => {
        //       this.showLoader = false;
        //       this.businessUser = true;
        //       this.businessEmail = err.email;
        //       this.deleteUserId = user_id;
        //       this.openDeleteBox();
        //     });
        //   }
        //   else if (user_type ==3 && err.code == "auth/account-exists-with-different-credential"){
        //     localStorage.setItem('access', err.credential['accessToken']);
        //     if(!tempPassword){
        //       tempPassword = 'asdf1234';
        //     }
        //     firebase.auth().fetchSignInMethodsForEmail(err.email)
        //       .then(providers => {
        //         firebase.auth().signInWithEmailAndPassword(err.email, tempPassword)
        //         .then(async result=>{
        //           result.user.linkAndRetrieveDataWithCredential(err.credential);
        //           localStorage.setItem('userID', result.user.uid);
        //           localStorage.setItem('usertoken', await result.user.getIdToken());
        //           const uid = result.user.uid;
        //           const photo = result.user.providerData[0].photoURL || 'https://upload.wikimedia.org/wikipedia/commons/3/38/Wikipedia_User-ICON_byNightsight.png';
        //           const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
        //           await userRef.set({
        //             account_type: 'starter',                  
        //             marketing: true,
        //             user_type: 1,
        //             avatar: photo
        //           }, {merge: true});
        //           this.getUser(uid);
        //         }).catch(err =>{
        //           console.log('link error',err);
        //         })
        //       });
        //   }
        // });
      });
    }, 1000);
  }

  getUser(uid){
    console.log('getting user with uid:', uid);
    this.authService.getUser(uid).subscribe(data => {
      console.log('user data found',data);
      localStorage.setItem('user', JSON.stringify(data['data']));
      if (data['data']['activeBrand']) {
        console.log('yes activeBrand', data['data']['activeBrand']);
        this.brandService.getBrandById(data['data']['activeBrand']).subscribe(res_brand => {
          console.log('active brand found',res_brand);
          localStorage.setItem('currentBrand', JSON.stringify(res_brand['brand']));
          this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
          this.showLoader = false;
        }, err => {
          console.log('active brand error',err);
          this.ngZone.run(() => this.router.navigate(['/fb-connect']));
          this.showLoader = false;
        });
      } else {
        console.log('no activeBrand');
        this.ngZone.run(() => this.router.navigate(['/fb-connect']));
        this.showLoader = false;
      }
    }, err => {
      console.log('user data error',err);
      this.showLoader = false;
    });
  }

  loginFB() {
    if (this.terms) {
      if(localStorage.getItem('loggedIn') == 'true'){
        this.ngZone.run(() => this.router.navigate(['/main/dashboard']));
      }else{
        localStorage.clear();
        this.firebaseAuth.auth.signOut();
        this.authService.doFacebookLogin();
      }
    } else {
      this.termsError = true;
    }
  }

  openDeleteBox(){
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'block';
  }

  closeDeleteBox(){
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
    localStorage.clear();
  }

  deleteUser(id){
    this.disableButton = true;
    this.authService.deleteUser(id).subscribe(data => {
      if(data['success'] == true){
        this.deleteSuccess = true;
      }
    });
  }

  continue(){
    (document.getElementById('myModal') as HTMLDivElement).style.display = 'none';
    localStorage.clear();
    this.firebaseAuth.auth.signOut();
    this.authService.doFacebookLogin();
  }

}
